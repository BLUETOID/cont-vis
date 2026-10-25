/**
 * Terminal Console Component for Virtual C++ Output
 */

import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';

interface TerminalConsoleProps {
  stdout: string;
  onClear?: () => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ stdout, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stdout]);

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Terminal size={14} color="#10b981" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-bright)' }}>
            Terminal (stdout)
          </span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="btn-secondary"
            style={{ padding: '2px 6px', fontSize: '10px' }}
            title="Clear Console"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div
        style={{
          flex: 1,
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 10px',
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#34d399',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {stdout || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No output logged yet.</span>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
