/**
 * Interactive Top-Down Recursion DAG & Call Tree View
 */

import React, { useMemo } from 'react';
import type { RecursionTreeState } from '../../types/dp';
import { computeRecursionTreeLayout } from '../../core/dp/recursionLayout';

interface RecursionDAGViewProps {
  tree: RecursionTreeState | null;
}

export const RecursionDAGView: React.FC<RecursionDAGViewProps> = ({ tree }) => {
  if (!tree || Object.keys(tree.nodes).length === 0) {
    return (
      <div
        style={{
          padding: '60px',
          color: 'var(--text-muted)',
          fontSize: '14px',
          fontStyle: 'italic',
        }}
      >
        No recursion tree available for this execution. Switch to Top-Down mode or click &quot;Run C++&quot;.
      </div>
    );
  }

  const { nodes, bounds } = useMemo(() => computeRecursionTreeLayout(tree), [tree]);
  const nodeIds = Object.keys(nodes);
  const activeNodeId = tree.activeNodeId;

  return (
    <div
      style={{
        position: 'relative',
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
        padding: '20px',
      }}
    >
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <marker
            id="tree-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 2 L 8 5 L 0 8 z" fill="#475569" />
          </marker>
        </defs>

        {/* Tree Edges (Cubic Bézier Splines) */}
        {nodeIds.map((id) => {
          const node = nodes[id];
          if (!node.parentId || !nodes[node.parentId]) return null;
          const parent = nodes[node.parentId];

          const startX = parent.x ?? 0;
          const startY = (parent.y ?? 0) + 24;
          const endX = node.x ?? 0;
          const endY = (node.y ?? 0) - 24;
          const dy = (endY - startY) * 0.5;

          const isMemoHit = node.status === 'memo_hit';
          const strokeColor = isMemoHit ? '#34d399' : '#334155';

          return (
            <path
              key={`edge-${id}`}
              d={`M ${startX} ${startY} C ${startX} ${startY + dy}, ${endX} ${endY - dy}, ${endX} ${endY}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={isMemoHit ? 2 : 1.8}
              strokeDasharray={isMemoHit ? '4 3' : 'none'}
              markerEnd="url(#tree-arrow)"
              opacity="0.8"
            />
          );
        })}
      </svg>

      {/* HTML Tree Nodes positioned via absolute coordinates */}
      {nodeIds.map((id) => {
        const node = nodes[id];
        const x = node.x ?? 0;
        const y = node.y ?? 0;
        const isActive = activeNodeId === id;
        const isMemoHit = node.status === 'memo_hit';
        const hasReturn = node.returnValue !== undefined;

        const argsStr = Object.values(node.args)
          .map((v) => (typeof v === 'object' ? '...' : String(v)))
          .join(', ');

        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: isActive ? 30 : 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Node Pill */}
            <div
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: isMemoHit
                  ? 'rgba(16, 185, 129, 0.2)'
                  : isActive
                  ? 'rgba(245, 158, 11, 0.25)'
                  : 'var(--bg-secondary)',
                border: isMemoHit
                  ? '2px solid #10b981'
                  : isActive
                  ? '2px solid #f59e0b'
                  : '1px solid #374151',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 600,
                color: isMemoHit ? '#34d399' : isActive ? '#fbbf24' : '#f3f4f6',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{node.name}({argsStr})</span>
              {hasReturn && (
                <span
                  style={{
                    background: '#1e3a8a',
                    color: '#93c5fd',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                >
                  → {String(node.returnValue)}
                </span>
              )}
            </div>

            {/* Memo Hit Tag */}
            {isMemoHit && (
              <span
                style={{
                  fontSize: '10px',
                  color: '#34d399',
                  fontWeight: 700,
                  marginTop: '2px',
                }}
              >
                ★ CACHED
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
