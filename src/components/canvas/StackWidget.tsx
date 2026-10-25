/**
 * Stack Visualizer Widget
 * High-performance, crisp flat styling without shadow glow
 */

import React from 'react';
import type { StackVisualState } from '../../types/visualizer';
import { Layers } from 'lucide-react';

interface StackWidgetProps {
  state: StackVisualState;
}

export const StackWidget: React.FC<StackWidgetProps> = ({ state }) => {
  const { name, items, topIndex } = state;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '14px 16px',
        minWidth: '200px',
        display: 'flex',
        flexDirection: 'column',
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
          <Layers size={15} color="#10b981" />
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#34d399',
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
            stack&lt;int&gt; [{items.length}]
          </span>
        </div>
      </div>

      {/* Vertical Container */}
      <div
        style={{
          minHeight: '160px',
          maxHeight: '340px',
          borderLeft: '2px solid #10b981',
          borderRight: '2px solid #10b981',
          borderBottom: '3px solid #10b981',
          borderRadius: '0 0 6px 6px',
          padding: '6px 8px',
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '6px',
          overflowY: 'auto',
          background: 'rgba(16, 185, 129, 0.05)',
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              margin: 'auto',
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontStyle: 'italic',
            }}
          >
            (empty stack)
          </div>
        ) : (
          items.map((val, idx) => {
            const isTop = idx === topIndex;
            return (
              <div
                key={idx}
                style={{
                  background: isTop ? '#064e3b' : 'var(--bg-tertiary)',
                  border: isTop ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: isTop ? '#a7f3d0' : '#f3f4f6',
                  }}
                >
                  {String(val)}
                </span>

                {isTop ? (
                  <span
                    style={{
                      fontSize: '9px',
                      padding: '1px 5px',
                      background: '#10b981',
                      color: '#064e3b',
                      borderRadius: '3px',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                    }}
                  >
                    TOP
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#6b7280',
                      fontFamily: 'monospace',
                    }}
                  >
                    [{idx}]
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
