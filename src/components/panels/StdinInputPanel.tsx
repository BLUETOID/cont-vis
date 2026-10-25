/**
 * Input (stdin) Panel for user-provided data read by cin >>
 */

import React from 'react';
import { Keyboard, CornerDownLeft } from 'lucide-react';

interface StdinInputPanelProps {
  stdin: string;
  onChangeStdin: (val: string) => void;
  onApply: () => void;
}

export const StdinInputPanel: React.FC<StdinInputPanelProps> = ({
  stdin,
  onChangeStdin,
  onApply,
}) => {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
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
          <Keyboard size={13} color="#10b981" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-bright)' }}>
            Standard Input (cin)
          </span>
        </div>
        <button
          onClick={onApply}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 10px',
            background: 'var(--bg-tertiary)',
            border: '1px solid #10b981',
            borderRadius: '4px',
            color: '#34d399',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Apply input and re-run code"
        >
          <CornerDownLeft size={11} />
          Apply & Run
        </button>
      </div>

      <textarea
        value={stdin}
        onChange={(e) => onChangeStdin(e.target.value)}
        placeholder="Enter space/newline-separated inputs for cin >> ..."
        style={{
          flex: 1,
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          padding: '8px 10px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '12px',
          color: 'var(--text-primary)',
          resize: 'none',
          outline: 'none',
        }}
      />
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Values read in sequence by <code>cin &gt;&gt; x;</code></span>
      </div>
    </div>
  );
};
