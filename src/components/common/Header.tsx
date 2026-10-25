/**
 * Top Header Navigation Bar
 * Custom Logo Icon, Template selector, and Reset
 */

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { CODE_TEMPLATES } from '../../presets/templates';

interface HeaderProps {
  currentTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onReset: () => void;
  onRunCode?: () => void;
  isExecuting?: boolean;
  stepCount?: number;
  finalAnswer?: any;
  stdout?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTemplateId,
  onSelectTemplate,
  onReset,
}) => {
  return (
    <header
      style={{
        height: 'var(--header-height, 56px)',
        background: '#121215',
        borderBottom: '1px solid #27272a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 100,
      }}
    >
      {/* Brand Icon Only (No Text) */}
      <div style={{ display: 'flex', alignItems: 'center' }} title="cont-vis">
        <svg
          width="34"
          height="34"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', borderRadius: '8px' }}
        >
          <defs>
            <linearGradient id="hdrBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#222226" />
              <stop offset="100%" stopColor="#121215" />
            </linearGradient>
            <linearGradient id="hdrEmerald" x1="35" y1="14" x2="50" y2="29" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="hdrPurple" x1="35" y1="35" x2="50" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          {/* Squircle Base Frame */}
          <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#hdrBg)" stroke="#3f3f46" strokeWidth="2" />

          {/* Matrix / Container 2D Grid Cells */}
          <rect x="14" y="14" width="15" height="15" rx="3.5" fill="#18181c" stroke="#52525b" strokeWidth="1.6" />
          <rect x="35" y="14" width="15" height="15" rx="3.5" fill="url(#hdrEmerald)" stroke="#34d399" strokeWidth="1.6" />
          <rect x="14" y="35" width="15" height="15" rx="3.5" fill="#27272a" stroke="#71717a" strokeWidth="1.6" />
          <rect x="35" y="35" width="15" height="15" rx="3.5" fill="url(#hdrPurple)" stroke="#d8b4fe" strokeWidth="1.6" />

          {/* Data nodes */}
          <circle cx="21.5" cy="21.5" r="2.5" fill="#34d399" />
          <circle cx="42.5" cy="21.5" r="2.5" fill="#ffffff" />
          <circle cx="21.5" cy="42.5" r="2.5" fill="#ffffff" />
          <circle cx="42.5" cy="42.5" r="2.5" fill="#ffffff" />

          {/* Transition paths */}
          <path d="M29 21.5H35" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
          <path d="M21.5 29V35" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
          <path d="M29 42.5H35" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" />
          <path d="M42.5 29V35" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Template Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 600 }}>
          Template:
        </span>
        <select
          value={currentTemplateId}
          onChange={(e) => onSelectTemplate(e.target.value)}
          style={{
            background: '#18181c',
            color: '#f4f4f5',
            border: '1px solid #27272a',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
          }}
        >
          {CODE_TEMPLATES.map((tmpl) => (
            <option key={tmpl.id} value={tmpl.id}>
              {tmpl.title}
            </option>
          ))}
        </select>
      </div>

      {/* Action Controls: Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            background: '#18181c',
            color: '#a1a1aa',
            border: '1px solid #27272a',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Reset to beginning of trace"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </header>
  );
};
