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
import { ChartProps, supersetTheme } from '@superset-ui/core';
import transformProps from '../../src/plugin/transformProps';

describe('SupersetPluginChartKpiCard transformProps', () => {
  const formData = {
    colorScheme: 'bnbColors',
    datasource: '3__table',
    granularity_sqla: 'ds',
  };
  const chartProps = new ChartProps({
    formData,
    width: 800,
    height: 600,
    theme: supersetTheme,
    queriesData: [{
      data: [
        { company: 'FC Union', status: 'DONE', count: 272 },
        { company: 'FC Union', status: 'OPEN', count: 45 },
        { company: 'BMW', status: 'DONE', count: 120 },
        { company: 'BMW', status: 'OPEN', count: 30 },
      ],
    }],
  });

  it('should transform chart props for viz', () => {
    expect(transformProps(chartProps)).toEqual({
      doneLabel: 'DONE',
      openLabel: 'OPEN',
      data: [
        {
          company: 'FC Union',
          done: 272,
          open: 45,
          donePercent: 85.80441640378549,
        },
        {
          company: 'BMW',
          done: 120,
          open: 30,
          donePercent: 80,
        },
      ],
    });
  });
});
