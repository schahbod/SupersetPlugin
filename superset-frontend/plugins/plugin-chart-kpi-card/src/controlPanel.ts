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
import { t } from '@superset-ui/core';

export default {
  controlPanelSections: [
    {
      label: t('KPI Card Settings'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'company_column',
            config: {
              type: 'SelectColumn',
              label: t('Company column'),
              description: t('Column that contains company names.'),
            },
          },
        ],
        [
          {
            name: 'status_column',
            config: {
              type: 'SelectColumn',
              label: t('Status column'),
              description: t('Column that contains status values like DONE or OPEN.'),
            },
          },
        ],
        [
          {
            name: 'count_column',
            config: {
              type: 'SelectColumn',
              label: t('Count column'),
              description: t('Numeric column to aggregate per company and status.'),
            },
          },
        ],
        [
          {
            name: 'done_status_value',
            config: {
              type: 'TextControl',
              label: t('Done status value'),
              default: 'DONE',
              description: t('Value from the status column to treat as DONE.'),
            },
          },
          {
            name: 'open_status_value',
            config: {
              type: 'TextControl',
              label: t('Open status value'),
              default: 'OPEN',
              description: t('Value from the status column to treat as OPEN.'),
            },
          },
        ],
      ],
    },
  ],
};
