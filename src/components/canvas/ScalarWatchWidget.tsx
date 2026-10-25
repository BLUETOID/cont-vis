/**
 * Scalar Variables Watch Widget
 * High-performance, crisp flat styling without shadow glow
 */

import React from 'react';
import type { ScalarVariables } from '../../types/visualizer';
import { Eye } from 'lucide-react';

interface ScalarWatchWidgetProps {
  scalars: ScalarVariables;
}

export const ScalarWatchWidget: React.FC<ScalarWatchWidgetProps> = ({ scalars }) => {
  const entries = Object.entries(scalars);

  if (entries.length === 0) return null;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '10px 14px',
        minWidth: '200px',
        maxWidth: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px',
        }}
      >
        <Eye size={13} color="var(--text-secondary)" />
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'monospace',
          }}
        >
          Variables Watch ({entries.length})
        </span>
      </div>

      {/* Scalar Badges */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        {entries.map(([key, val]) => {
          const isBool = typeof val === 'boolean';
          const isNum = typeof val === 'number';

          let valColor = '#34d399';
          if (isBool) valColor = val ? '#34d399' : '#f87171';
          else if (isNum) valColor = '#fbbf24';

          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            >
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{key}:</span>
              <span style={{ color: valColor, fontWeight: 700 }}>
                {String(val)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
