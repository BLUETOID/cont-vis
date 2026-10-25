/**
 * Queue Visualizer Widget
 * High-performance, crisp flat styling without shadow glow
 */

import React from 'react';
import type { QueueVisualState } from '../../types/visualizer';
import { MoveHorizontal } from 'lucide-react';

interface QueueWidgetProps {
  state: QueueVisualState;
}

export const QueueWidget: React.FC<QueueWidgetProps> = ({ state }) => {
  const { name, items } = state;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '14px 16px',
        minWidth: '280px',
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
          <MoveHorizontal size={15} color="#10b981" />
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
            queue&lt;int&gt; [{items.length}]
          </span>
        </div>
      </div>

      {/* Horizontal Pipe */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          background: 'rgba(16, 185, 129, 0.05)',
          borderTop: '2px solid #10b981',
          borderBottom: '2px solid #10b981',
          borderRadius: '4px',
          overflowX: 'auto',
        }}
      >
        {/* FRONT */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '9px',
            fontWeight: 800,
            color: '#34d399',
            fontFamily: 'monospace',
            paddingRight: '6px',
            borderRight: '1px solid var(--border-subtle)',
          }}
        >
          <span>FRONT</span>
          <span style={{ fontSize: '8px' }}>POP</span>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontStyle: 'italic',
              margin: 'auto',
            }}
          >
            (empty queue)
          </div>
        ) : (
          items.map((val, idx) => {
            const isFront = idx === 0;

            return (
              <div
                key={idx}
                style={{
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  background: isFront ? '#064e3b' : 'var(--bg-tertiary)',
                  border: isFront ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: isFront ? '#d1fae5' : 'var(--text-primary)',
                }}
              >
                {String(val)}
              </div>
            );
          })
        )}

        {/* BACK */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '9px',
            fontWeight: 800,
            color: '#10b981',
            fontFamily: 'monospace',
            paddingLeft: '6px',
            borderLeft: '1px solid var(--border-subtle)',
          }}
        >
          <span>BACK</span>
          <span style={{ fontSize: '8px' }}>PUSH</span>
        </div>
      </div>
    </div>
  );
};
