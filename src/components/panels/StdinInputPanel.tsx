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
        background: '#111827',
        border: '1px solid #374151',
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
          <Keyboard size={13} color="#38bdf8" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#f3f4f6' }}>
            Standard Input (cin)
          </span>
        </div>
        <button
          onClick={onApply}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            background: '#1e293b',
            border: '1px solid #3b82f6',
            borderRadius: '4px',
            color: '#93c5fd',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          title="Apply input and re-run code"
        >
          <CornerDownLeft size={10} />
          Apply & Run
        </button>
      </div>

      <textarea
        value={stdin}
        onChange={(e) => onChangeStdin(e.target.value)}
        placeholder="Enter space/newline-separated inputs for cin >> ..."
        style={{
          flex: 1,
          background: '#0a0f1d',
          border: '1px solid #374151',
          borderRadius: '4px',
          padding: '8px 10px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#f8fafc',
          resize: 'none',
          outline: 'none',
        }}
      />
      <div style={{ fontSize: '10px', color: '#6b7280', display: 'flex', justifyContent: 'space-between' }}>
        <span>Values read in sequence by <code>cin &gt;&gt; x;</code></span>
      </div>
    </div>
  );
};
