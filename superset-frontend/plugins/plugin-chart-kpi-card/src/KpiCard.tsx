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
import React from 'react';
import { styled } from '@superset-ui/core';
import { KpiTileData } from './types';

interface KpiCardProps {
  tile: KpiTileData;
  doneLabel: string;
  openLabel: string;
}

const Card: any = styled.article`
  width: 220px;
  height: 120px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px;
  }

  .company-title {
    margin: 0;
    font-size: 20px;
    line-height: 1;
    font-weight: 600;
    color: #222;
    text-align: left;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content {
    display: flex;
    height: 80px;
    border-top: 1px solid #ddd;
  }

  .left,
  .right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .left {
    padding: 4px 8px;
  }

  .right {
    border-left: 1px solid #ddd;
    padding: 4px 8px;
  }

  .metric-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .metric-label {
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    margin-top: 2px;
  }

  .open-value {
    color: #ff4a1c;
    font-weight: 600;
    line-height: 0.9;
  }

  .done-value {
    color: #0b4ea2;
    font-weight: 600;
    line-height: 0.9;
    text-align: center;
  }

  .open-label {
    color: #ff4a1c;
  }

  .done-label {
    color: #0b4ea2;
  }

  .pie {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
  }
`;

export default function KpiCard({ tile, doneLabel, openLabel }: KpiCardProps) {
  const companyName = String(tile.company ?? '').trim() || 'Unknown Company';
  const total = tile.done + tile.open;
  const donePercent = total > 0 ? (tile.done / total) * 100 : 0;
  const pieStyle: React.CSSProperties = {
    background: `conic-gradient(#0b4ea2 0% ${donePercent}%, #ff4a1c ${donePercent}% 100%)`,
  };

  const BIG = 52;
  const SMALL = 30;
  const openSize = tile.open >= tile.done ? BIG : SMALL;
  const doneSize = tile.done > tile.open ? BIG : SMALL;

  return (
    <Card>
      <div className="title-row">
        <div className="company-title" title={companyName}>{companyName}</div>
        <div className="pie" style={pieStyle} />
      </div>
      <div className="content">
        <div className="left">
          <div className="metric-stack">
            <div className="open-value" style={{ fontSize: openSize }}>
              {tile.open.toLocaleString()}
            </div>
            <div className="metric-label open-label">{openLabel}</div>
          </div>
        </div>

        <div className="right">
          <div className="metric-stack">
            <div className="done-value" style={{ fontSize: doneSize }}>
              {tile.done.toLocaleString()}
            </div>
            <div className="metric-label done-label">{doneLabel}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
