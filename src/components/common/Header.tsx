/**
 * Top Header Navigation Bar
 * Template selector, Run button, Reset, and brand badge
 */

import React from 'react';
import {
  Play,
  RotateCcw,
  Cpu,
} from 'lucide-react';
import { CODE_TEMPLATES } from '../../presets/templates';

interface HeaderProps {
  currentTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onRunCode: () => void;
  onReset: () => void;
  isExecuting: boolean;
  stepCount: number;
  finalAnswer?: any;
  stdout?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTemplateId,
  onSelectTemplate,
  onRunCode,
  onReset,
  isExecuting,
  stepCount,
  finalAnswer,
  stdout,
}) => {
  return (
    <header
      style={{
        height: 'var(--header-height, 56px)',
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 100,
      }}
    >
      {/* Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Cpu size={18} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px', color: '#f8fafc' }}>
              cont<span style={{ color: '#38bdf8' }}>-vis</span>
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              C++ Visualizer
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '-2px' }}>
            Array · Matrix · Stack · Queue · Deque · Heap · Set · Map
          </div>
        </div>
      </div>

      {/* Template Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
            Template:
          </span>
          <select
            value={currentTemplateId}
            onChange={(e) => onSelectTemplate(e.target.value)}
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#f1f5f9',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            {CODE_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {stepCount > 0 && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#93c5fd',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontFamily: 'monospace',
            }}
          >
            {stepCount} steps
            {stdout && stdout.trim()
              ? ` · Output: ${stdout.trim().split('\n').pop()}`
              : (finalAnswer !== undefined && finalAnswer !== 0 ? ` · Return: ${String(finalAnswer)}` : '')}
          </span>
        )}

        {/* Reset Trace Button */}
        <button
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            background: 'rgba(30, 41, 59, 0.7)',
            color: '#94a3b8',
            border: '1px solid rgba(71, 85, 105, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Reset to beginning of trace"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        {/* Run C++ Code Button */}
        <button
          onClick={onRunCode}
          disabled={isExecuting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            background: isExecuting
              ? '#1e3a8a'
              : '#2563eb',
            color: '#ffffff',
            border: 'none',
            cursor: isExecuting ? 'not-allowed' : 'pointer',
          }}
          title="Run C++ Code (Ctrl + Enter)"
        >
          <Play size={15} fill="#ffffff" />
          {isExecuting ? 'Executing...' : 'Run Code'}
          <span
            style={{
              fontSize: '10px',
              padding: '1px 5px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              marginLeft: '4px',
            }}
          >
            Ctrl+↵
          </span>
        </button>
      </div>
    </header>
  );
};
