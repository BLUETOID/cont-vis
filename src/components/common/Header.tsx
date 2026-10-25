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
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
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
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="hdrBlue" x1="35" y1="14" x2="50" y2="29" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="hdrPurple" x1="35" y1="35" x2="50" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          {/* Squircle Base Frame */}
          <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#hdrBg)" stroke="#334155" strokeWidth="2.5" />

          {/* Matrix / Container 2D Grid Cells */}
          <rect x="14" y="14" width="15" height="15" rx="3.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.8" />
          <rect x="35" y="14" width="15" height="15" rx="3.5" fill="url(#hdrBlue)" stroke="#60a5fa" strokeWidth="1.8" />
          <rect x="14" y="35" width="15" height="15" rx="3.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.8" />
          <rect x="35" y="35" width="15" height="15" rx="3.5" fill="url(#hdrPurple)" stroke="#d8b4fe" strokeWidth="1.8" />

          {/* Data nodes */}
          <circle cx="21.5" cy="21.5" r="2.5" fill="#38bdf8" />
          <circle cx="42.5" cy="21.5" r="2.5" fill="#ffffff" />
          <circle cx="21.5" cy="42.5" r="2.5" fill="#ffffff" />
          <circle cx="42.5" cy="42.5" r="2.5" fill="#ffffff" />

          {/* Transition paths */}
          <path d="M29 21.5H35" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
          <path d="M21.5 29V35" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <path d="M29 42.5H35" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" />
          <path d="M42.5 29V35" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Template Switcher */}
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

      {/* Action Controls: Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
      </div>
    </header>
  );
};
