/**
 * 1D Array / Vector Visualizer Widget
 * High-performance, crisp flat styling without shadow glow
 */

import React from 'react';
import type { ArrayVisualState, PointerVisualState } from '../../types/visualizer';

interface ArrayWidgetProps {
  state: ArrayVisualState;
  pointers?: Record<string, PointerVisualState>;
}

const POINTER_COLORS = [
  { bg: '#ef4444', text: '#ffffff' }, // Red
  { bg: '#3b82f6', text: '#ffffff' }, // Blue
  { bg: '#10b981', text: '#ffffff' }, // Emerald
  { bg: '#f59e0b', text: '#111827' }, // Amber
  { bg: '#8b5cf6', text: '#ffffff' }, // Purple
  { bg: '#ec4899', text: '#ffffff' }, // Pink
];

export const ArrayWidget: React.FC<ArrayWidgetProps> = ({ state, pointers = {} }) => {
  const { name, values, activeIndices, readIndices } = state;

  const getPointersForIndex = (idx: number) => {
    return Object.values(pointers).filter((p) => p.value === idx);
  };

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
            vector&lt;int&gt; [{values.length}]
          </span>
        </div>
      </div>

      {/* Array Strip */}
      {values.length === 0 ? (
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '12px',
            fontStyle: 'italic',
            border: '1px dashed var(--border-subtle)',
            borderRadius: '4px',
          }}
        >
          (empty array)
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '8px',
            paddingTop: '24px', // Space for pointer badges
          }}
        >
          {values.map((val, idx) => {
            const isActive = activeIndices.includes(idx);
            const isRead = readIndices.includes(idx);
            const matchingPointers = getPointersForIndex(idx);

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
              <div
                key={idx}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Floating Pointer Badges */}
                {matchingPointers.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-22px',
                      display: 'flex',
                      gap: '2px',
                      zIndex: 10,
                    }}
                  >
                    {matchingPointers.map((p, pIdx) => {
                      const color = POINTER_COLORS[pIdx % POINTER_COLORS.length];
                      return (
                        <div
                          key={p.name}
                          style={{
                            padding: '1px 5px',
                            background: color.bg,
                            color: color.text,
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <span>{p.name}</span>
                          <span style={{ fontSize: '8px' }}>▼</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Main Cell */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: bg,
                    border: `1.5px solid ${borderColor}`,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: textColor,
                  }}
                >
                  {val !== null && val !== undefined ? String(val) : '—'}
                </div>

                {/* Index Label */}
                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '10px',
                    color: isActive ? '#f59e0b' : '#6b7280',
                    fontFamily: 'monospace',
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  [{idx}]
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
