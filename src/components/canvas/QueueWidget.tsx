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
        background: '#111827',
        border: '1px solid #374151',
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
          <MoveHorizontal size={15} color="#0ea5e9" />
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#38bdf8',
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '4px',
              background: '#1f2937',
              color: '#9ca3af',
              border: '1px solid #374151',
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
          background: '#0c4a6e15',
          borderTop: '2px solid #0ea5e9',
          borderBottom: '2px solid #0ea5e9',
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
            color: '#38bdf8',
            fontFamily: 'monospace',
            paddingRight: '6px',
            borderRight: '1px solid #374151',
          }}
        >
          <span>FRONT</span>
          <span style={{ fontSize: '8px' }}>POP</span>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              color: '#6b7280',
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
                  background: isFront ? '#0c4a6e' : '#1f2937',
                  border: isFront ? '1.5px solid #0ea5e9' : '1px solid #374151',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: isFront ? '#bae6fd' : '#f3f4f6',
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
            color: '#0ea5e9',
            fontFamily: 'monospace',
            paddingLeft: '6px',
            borderLeft: '1px solid #374151',
          }}
        >
          <span>BACK</span>
          <span style={{ fontSize: '8px' }}>PUSH</span>
        </div>
      </div>
    </div>
  );
};
