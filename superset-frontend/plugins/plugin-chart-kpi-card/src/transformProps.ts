/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ChartProps } from '@superset-ui/core';
import {
  KpiRawRecord,
  KpiTileData,
  SupersetPluginChartKpiCardProps,
  SupersetPluginChartKpiCardQueryFormData,
} from './types';

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toComparableStatus(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

interface KpiAccumulator {
  done: number;
  open: number;
}

function getFirstDefinedValue(
  row: KpiRawRecord,
  candidates: Array<string | undefined>,
): unknown {
  for (const candidate of candidates) {
    if (candidate && row[candidate] !== undefined && row[candidate] !== null) {
      return row[candidate];
    }
  }

  return undefined;
}

// ## const isJestRuntime = Boolean((globalThis as { process?: { env?: Record<string, string> } }).process?.env?.JEST_WORKER_ID);
// ## const USE_FIXED_TEST_TILES = !isJestRuntime;
// ##
// ## const FIXED_TEST_TILES: Array<{ company: string; open: number; done: number }> = [
// ##   { company: '1. FC Union', open: 194, done: 272 },
// ##   { company: '1. FC Union Flock', open: 92, done: 2 },
// ##   { company: 'Adam Audio', open: 10, done: 0 },
// ##   { company: 'Bela Living', open: 3, done: 31 },
// ##   { company: 'Deutsche Bahn', open: 0, done: 2 },
// ##   { company: 'Eve Motion', open: 1, done: 263 },
// ##   { company: 'Focusrite', open: 23, done: 6 },
// ##   { company: 'FST Fertigware', open: 6, done: 18 },
// ##   { company: 'FST Leergut', open: 0, done: 2 },
// ##   { company: 'FST Rohstoff M', open: 1, done: 1 },
// ##   { company: 'FST Rohstoffe', open: 1, done: 2 },
// ##   { company: 'FST Werkzeug', open: 1, done: 0 },
// ##   { company: 'GWP', open: 7, done: 0 },
// ##   { company: 'Jetlag', open: 0, done: 3 },
// ##   { company: 'Koch Membranen', open: 1, done: 0 },
// ##   { company: 'Köster', open: 1, done: 1 },
// ##   { company: 'Lendis GmbH', open: 17, done: 6 },
// ##   { company: 'Maison Baum', open: 0, done: 24 },
// ##   { company: 'Manolya', open: 37, done: 29 },
// ##   { company: 'Mediakos', open: 0, done: 6 },
// ##   { company: 'MSA Europe', open: 1, done: 0 },
// ##   { company: 'Optisan', open: 1, done: 0 },
// ##   { company: 'Parterremedia', open: 5, done: 41 },
// ##   { company: 'Rieck Werbem.', open: 1, done: 1 },
// ##   { company: 'Sagenta', open: 24, done: 94 },
// ##   { company: 'Schindelhauer', open: 2, done: 0 },
// ##   { company: 'SGS', open: 1, done: 6 },
// ##   { company: 'Siemens Mess', open: 1, done: 17 },
// ##   { company: 'Siemens Röhre', open: 4, done: 38 },
// ##   { company: 'Siemens Schalt', open: 80, done: 567 },
// ##   { company: 'UPPER GARDEN', open: 1, done: 0 },
// ##   { company: 'Wandrey', open: 0, done: 15 },
// ##   { company: 'Warmies', open: 127, done: 46 },
// ## ];

export default function transformProps(chartProps: ChartProps): SupersetPluginChartKpiCardProps {
  const { formData, queriesData } = chartProps;
  const typedFormData = formData as SupersetPluginChartKpiCardQueryFormData & {
    open_column?: string;
    done_column?: string;
  };

   // Spaltennamen, wie sie im Kontrollfeld des Diagramms konfiguriert sind.
  // Greift auf die tatsächlichen Spaltennamen Ihrer SQL-Abfrage zurück (firmaname, zu_packen, erledigt),
  // falls das Kontrollfeld noch nicht konfiguriert wurde.
  const companyColumn = typedFormData.company_column;
  const openColumn = typedFormData.open_column;
  const doneColumn = typedFormData.done_column;
  const doneLabel = (typedFormData.done_status_value || 'DONE').trim() || 'DONE';
  const openLabel = (typedFormData.open_status_value || 'OPEN').trim() || 'OPEN';

  // ## if (USE_FIXED_TEST_TILES) {
  // ##   return {
  // ##     data: FIXED_TEST_TILES.map(item => {
  // ##       const total = item.done + item.open;
  // ##       return {
  // ##         company: item.company,
  // ##         open: item.open,
  // ##         done: item.done,
  // ##         donePercent: total > 0 ? (item.done / total) * 100 : 0,
  // ##       };
  // ##     }),
  // ##     doneLabel,
  // ##     openLabel,
  // ##   };
  // ## }

  const rows = (queriesData?.[0]?.data || []) as KpiRawRecord[];
  const data: KpiTileData[] = openColumn || doneColumn
    ? rows.map(row => {
        const company = String(
          getFirstDefinedValue(row, [companyColumn, 'firmaname', 'company', 'name']) ?? '',
        ).trim();

        const open = toNumber(
          getFirstDefinedValue(row, [openColumn, 'zu_packen', 'open']),
        );
        const done = toNumber(
          getFirstDefinedValue(row, [doneColumn, 'erledigt', 'done']),
        );

        const total = open + done;
        const donePercent = total > 0 ? (done / total) * 100 : 0;

        return {
          company: company || 'Unknown Company',
          done,
          open,
          donePercent,
        };
      })
    : (() => {
        const companyKeyed = rows.reduce<Record<string, KpiAccumulator>>((acc, row) => {
          const company = String(
            getFirstDefinedValue(row, [
              companyColumn,
              'FirmaName',
              'company',
              'DESTINATION_AIRPORT',
              'name',
            ]) ?? '',
          ).trim();
          const companyKey = company || 'Unknown Company';
          const status = toComparableStatus(
            getFirstDefinedValue(row, [typedFormData.status_column, 'Status', 'status']),
          );
          const count = toNumber(
            getFirstDefinedValue(row, [
              typedFormData.count_column,
              'kpi_value',
              typedFormData.count_column ? `sum__${typedFormData.count_column}` : undefined,
              typedFormData.count_column ? `SUM(${typedFormData.count_column})` : undefined,
              'count',
              'Count',
              'value',
            ]),
          );

          if (!acc[companyKey]) {
            acc[companyKey] = { done: 0, open: 0 };
          }

          if (!status || status === toComparableStatus(doneLabel)) {
            acc[companyKey].done += count;
          } else if (status === toComparableStatus(openLabel)) {
            acc[companyKey].open += count;
          } else {
            acc[companyKey].open += count;
          }

          return acc;
        }, {});

        return Object.entries(companyKeyed).map(([company, item]) => {
          const total = item.done + item.open;
          return {
            company,
            done: item.done,
            open: item.open,
            donePercent: total > 0 ? (item.done / total) * 100 : 0,
          };
        });
      })();

  return {
    data,
    doneLabel,
    openLabel,
  };
}
