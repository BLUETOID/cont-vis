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
        background: '#111827',
        border: '1px solid #374151',
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
        <Eye size={13} color="#9ca3af" />
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#9ca3af',
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

          let valColor = '#38bdf8';
          if (isBool) valColor = val ? '#34d399' : '#f87171';
          else if (isNum) valColor = '#fbbf24';

          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            >
              <span style={{ color: '#9ca3af', fontWeight: 600 }}>{key}:</span>
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
