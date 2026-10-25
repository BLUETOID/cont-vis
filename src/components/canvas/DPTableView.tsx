/**
 * Interactive 1D & 2D Dynamic Programming Table / Grid View
 */

import React, { useMemo } from 'react';
import type { DPTableState, DPPosition } from '../../types/dp';

interface DPTableViewProps {
  table: DPTableState | null;
  backtrackPath?: DPPosition[];
}

export const DPTableView: React.FC<DPTableViewProps> = ({ table, backtrackPath = [] }) => {
  if (!table || table.rows === 0 || table.cols === 0) {
    return (
      <div
        style={{
          padding: '60px',
          color: 'var(--text-muted)',
          fontSize: '14px',
          fontStyle: 'italic',
        }}
      >
        No DP table initialized yet. Click &quot;Run C++&quot; to begin.
      </div>
    );
  }

  const { rows, cols, values, activeCell, readDependencies, rowLabels, colLabels } = table;

  const CELL_WIDTH = 68;
  const CELL_HEIGHT = 48;
  const HEADER_WIDTH = 130;
  const HEADER_HEIGHT = 38;

  // Set of read dependency cell keys
  const readDepSet = useMemo(() => {
    const set = new Set<string>();
    for (const d of readDependencies) {
      set.add(`${d.row},${d.col}`);
    }
    return set;
  }, [readDependencies]);

  // Set of backtrack path cell keys
  const backtrackSet = useMemo(() => {
    const set = new Set<string>();
    for (const p of backtrackPath) {
      set.add(`${p.row},${p.col}`);
    }
    return set;
  }, [backtrackPath]);

  // Center coordinate of a cell relative to grid content
  const getCellCenter = (r: number, c: number) => {
    const x = HEADER_WIDTH + c * CELL_WIDTH + CELL_WIDTH / 2;
    const y = HEADER_HEIGHT + r * CELL_HEIGHT + CELL_HEIGHT / 2;
    return { x, y };
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '24px',
        background: 'rgba(15, 23, 42, 0.65)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Table Title & Dimension Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-bright)' }}>
            State Table: <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{table.name}</code>
          </span>
          <span className="badge badge-emerald">
            {table.dimensions === 1 ? `1D (${cols} elements)` : `2D (${rows} × ${cols})`}
          </span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {/* SVG Layer for Dependency & Backtrack Curved Arrows */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: HEADER_WIDTH + cols * CELL_WIDTH,
            height: HEADER_HEIGHT + rows * CELL_HEIGHT,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <defs>
            {/* Dependency Arrow Marker */}
            <marker
              id="dep-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#a78bfa" />
            </marker>

            {/* Backtrack Arrow Marker */}
            <marker
              id="backtrack-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#22d3ee" />
            </marker>
          </defs>

          {/* Draw Curved Bézier Arrows for Read Dependencies */}
          {activeCell &&
            readDependencies.map((dep, idx) => {
              const start = getCellCenter(dep.row, dep.col);
              const end = getCellCenter(activeCell.row, activeCell.col);
              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const cx1 = start.x + dx * 0.2 - dy * 0.2;
              const cy1 = start.y + dy * 0.2 + dx * 0.2;
              const cx2 = start.x + dx * 0.8 - dy * 0.2;
              const cy2 = start.y + dy * 0.8 + dx * 0.2;

              return (
                <path
                  key={`dep-${idx}`}
                  d={`M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`}
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  markerEnd="url(#dep-arrow)"
                  opacity="0.9"
                />
              );
            })}

          {/* Draw Backtrack Path Links */}
          {backtrackPath.length > 1 &&
            backtrackPath.slice(0, -1).map((curr, idx) => {
              const next = backtrackPath[idx + 1];
              const p1 = getCellCenter(curr.row, curr.col);
              const p2 = getCellCenter(next.row, next.col);
              return (
                <line
                  key={`bt-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#06b6d4"
                  strokeWidth="3.5"
                  markerEnd="url(#backtrack-arrow)"
                  opacity="0.95"
                />
              );
            })}
        </svg>

        {/* HTML Grid Structure */}
        <table
          style={{
            borderCollapse: 'separate',
            borderSpacing: '4px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {/* Column Headers */}
          <thead>
            <tr>
              <th
                style={{
                  width: `${HEADER_WIDTH}px`,
                  height: `${HEADER_HEIGHT}px`,
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textAlign: 'left',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {table.rowHeaderTitle || 'Index / Item'}
              </th>
              {Array.from({ length: cols }).map((_, c) => (
                <th
                  key={`col-${c}`}
                  style={{
                    width: `${CELL_WIDTH}px`,
                    height: `${HEADER_HEIGHT}px`,
                    background: 'var(--bg-secondary)',
                    color: 'var(--accent-emerald)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textAlign: 'center',
                    padding: '4px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {colLabels[c] || `j = ${c}`}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body Cells */}
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={`row-${r}`}>
                {/* Row Header */}
                <td
                  style={{
                    width: `${HEADER_WIDTH}px`,
                    height: `${CELL_HEIGHT}px`,
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={rowLabels[r] || `i = ${r}`}
                >
                  {rowLabels[r] || `i = ${r}`}
                </td>

                {/* Grid Cells */}
                {Array.from({ length: cols }).map((_, c) => {
                  const val = values[r]?.[c];
                  const isActive = activeCell?.row === r && activeCell?.col === c;
                  const isReadDep = readDepSet.has(`${r},${c}`);
                  const isBacktrack = backtrackSet.has(`${r},${c}`);
                  const hasValue = val !== null && val !== undefined;

                  let cellBg = 'var(--bg-secondary)';
                  let cellBorder = '1px solid var(--border-subtle)';
                  let cellColor = hasValue ? 'var(--text-primary)' : 'var(--text-muted)';

                  if (isActive) {
                    cellBg = 'rgba(245, 158, 11, 0.25)';
                    cellBorder = '2px solid #fbbf24';
                    cellColor = '#fef08a';
                  } else if (isBacktrack) {
                    cellBg = 'rgba(16, 185, 129, 0.25)';
                    cellBorder = '2px solid #34d399';
                    cellColor = '#a7f3d0';
                  } else if (isReadDep) {
                    cellBg = 'rgba(168, 85, 247, 0.2)';
                    cellBorder = '2px solid #a855f7';
                    cellColor = '#c4b5fd';
                  } else if (hasValue) {
                    cellBg = 'var(--bg-tertiary)';
                  }

                  return (
                    <td
                      key={`cell-${r}-${c}`}
                      style={{
                        width: `${CELL_WIDTH}px`,
                        height: `${CELL_HEIGHT}px`,
                        background: cellBg,
                        border: cellBorder,
                        color: cellColor,
                        fontSize: '13px',
                        fontWeight: isActive || isBacktrack ? 700 : 500,
                        textAlign: 'center',
                        borderRadius: 'var(--radius-sm)',
                        position: 'relative',
                        transition: 'all 0.15s ease-out',
                      }}
                    >
                      {hasValue ? val : <span style={{ opacity: 0.3 }}>·</span>}

                      {/* Small badge indicators */}
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '3px',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#fbbf24',
                          }}
                        />
                      )}
                      {isBacktrack && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '3px',
                            fontSize: '9px',
                            color: '#22d3ee',
                          }}
                        >
                          ★
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
