/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.
 */

import { QueryFormData } from '@superset-ui/core';

export interface KpiRawRecord {
  [key: string]: unknown;
}

export interface KpiTileData {
  company: string;
  done: number;
  open: number;
  donePercent: number;
}

export type SupersetPluginChartKpiCardQueryFormData = QueryFormData & {
  company_column?: string;
  status_column?: string;
  count_column?: string;
  done_status_value?: string;
  open_status_value?: string;
};

export interface SupersetPluginChartKpiCardProps {
  data: KpiTileData[];
  doneLabel: string;
  openLabel: string;
}