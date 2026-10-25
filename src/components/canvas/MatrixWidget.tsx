/**
 * 2D Matrix / Grid Visualizer Widget
 * High-performance, crisp flat styling without shadow glow
 */

import React from 'react';
import type { MatrixVisualState } from '../../types/visualizer';

interface MatrixWidgetProps {
  state: MatrixVisualState;
}

export const MatrixWidget: React.FC<MatrixWidgetProps> = ({ state }) => {
  const { name, rows, cols, values, activeCell, readCells = [] } = state;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '14px 16px',
        minWidth: '300px',
        maxWidth: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#a78bfa',
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            vector&lt;vector&lt;int&gt;&gt; [{rows}×{cols}]
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div
        style={{
          overflowX: 'auto',
          overflowY: 'auto',
          maxHeight: '400px',
        }}
      >
        <table
          style={{
            borderCollapse: 'separate',
            borderSpacing: '4px',
            fontFamily: 'monospace',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: '36px',
                  height: '24px',
                  color: 'var(--text-muted)',
                  fontSize: '10px',
                }}
              >
                r \ c
              </th>
              {Array.from({ length: cols }).map((_, c) => {
                const isColActive = activeCell?.c === c;
                return (
                  <th
                    key={c}
                    style={{
                      width: '44px',
                      height: '24px',
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: isColActive ? 700 : 500,
                      color: isColActive ? '#f59e0b' : 'var(--text-secondary)',
                      background: isColActive ? '#78350f' : 'var(--bg-tertiary)',
                      borderRadius: '3px',
                    }}
                  >
                    [{c}]
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => {
              const isRowActive = activeCell?.r === r;
              return (
                <tr key={r}>
                  {/* Row Header */}
                  <th
                    style={{
                      width: '36px',
                      height: '40px',
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: isRowActive ? 700 : 500,
                      color: isRowActive ? '#f59e0b' : 'var(--text-secondary)',
                      background: isRowActive ? '#78350f' : 'var(--bg-tertiary)',
                      borderRadius: '3px',
                    }}
                  >
                    [{r}]
                  </th>

                  {/* Row Cells */}
                  {Array.from({ length: cols }).map((_, c) => {
                    const val = values[r]?.[c];
                    const isActive = activeCell?.r === r && activeCell?.c === c;
                    const isRead = readCells.some((rc) => rc.r === r && rc.c === c);

                    let bg = 'var(--bg-tertiary)';
                    let borderColor = 'var(--border-subtle)';
                    let textColor = 'var(--text-primary)';

                    if (isActive) {
                      bg = '#78350f';
                      borderColor = '#f59e0b';
                      textColor = '#fef3c7';
                    } else if (isRead) {
                      bg = '#4c1d95';
                      borderColor = '#8b5cf6';
                      textColor = '#ede9fe';
                    }

                    return (
                      <td
                        key={c}
                        style={{
                          width: '44px',
                          height: '40px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          background: bg,
                          border: `1.5px solid ${borderColor}`,
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: textColor,
                        }}
                      >
                        {val !== null && val !== undefined ? String(val) : '—'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
