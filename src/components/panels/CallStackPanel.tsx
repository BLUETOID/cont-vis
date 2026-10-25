/**
 * Recursion Call Stack & Local Variable Inspector
 */

import React from 'react';
import { Layers } from 'lucide-react';
import type { CallStackFrame } from '../../types/dp';

interface CallStackPanelProps {
  callStack: CallStackFrame[];
}

export const CallStackPanel: React.FC<CallStackPanelProps> = ({ callStack }) => {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={15} color="var(--accent-indigo)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-bright)' }}>
            Call Stack ({callStack.length})
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {callStack.length === 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '10px' }}>
            Call stack empty.
          </div>
        ) : (
          callStack
            .slice()
            .reverse()
            .map((frame, idx) => (
              <div
                key={idx}
                style={{
                  background: idx === 0 ? 'rgba(79, 70, 229, 0.15)' : 'var(--bg-primary)',
                  border: idx === 0 ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c4b5fd', fontWeight: 600 }}>
                  <span>{frame.name}()</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>line {frame.line}</span>
                </div>

                {Object.keys(frame.args).length > 0 && (
                  <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
                    {Object.entries(frame.args).map(([k, v]) => (
                      <div key={k}>
                        <span style={{ color: 'var(--text-muted)' }}>{k}:</span> {JSON.stringify(v)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};
