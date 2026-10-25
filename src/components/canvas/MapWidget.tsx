/**
 * Hash Map / Unordered Map Visualizer Widget
 * High-performance, crisp flat styling without shadow glow
 */

import React from 'react';
import type { MapVisualState } from '../../types/visualizer';
import { Database } from 'lucide-react';

interface MapWidgetProps {
  state: MapVisualState;
}

export const MapWidget: React.FC<MapWidgetProps> = ({ state }) => {
  const { name, entries, activeKey } = state;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '14px 16px',
        minWidth: '260px',
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
          <Database size={15} color="#f59e0b" />
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#fbbf24',
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
            unordered_map [{entries.length}]
          </span>
        </div>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div
          style={{
            padding: '14px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontStyle: 'italic',
            border: '1px dashed var(--border-subtle)',
            borderRadius: '4px',
          }}
        >
          (empty map)
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '6px',
            maxHeight: '260px',
            overflowY: 'auto',
          }}
        >
          {entries.map(([key, val], idx) => {
            const isActive = activeKey !== undefined && activeKey === key;
            return (
              <div
                key={idx}
                style={{
                  background: isActive ? '#78350f' : 'var(--bg-tertiary)',
                  border: isActive ? '1.5px solid #f59e0b' : '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '9px',
                      color: '#9ca3af',
                      fontFamily: 'monospace',
                    }}
                  >
                    Key
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: isActive ? '#fef3c7' : '#e5e7eb',
                    }}
                  >
                    {String(key)}
                  </span>
                </div>

                <span style={{ color: '#6b7280', fontSize: '11px' }}>→</span>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span
                    style={{
                      fontSize: '9px',
                      color: '#9ca3af',
                      fontFamily: 'monospace',
                    }}
                  >
                    Val
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: isActive ? '#fcd34d' : '#38bdf8',
                    }}
                  >
                    {String(val)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
