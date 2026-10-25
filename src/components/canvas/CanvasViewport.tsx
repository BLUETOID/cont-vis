/**
 * Infinite Vector Canvas Viewport with Zoom, Pan, and View Mode Switcher
 */

import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Grid, GitBranch } from 'lucide-react';

export type CanvasViewMode = 'table' | 'tree' | 'split';

interface CanvasViewportProps {
  viewMode?: CanvasViewMode;
  onChangeViewMode?: (mode: CanvasViewMode) => void;
  children: React.ReactNode;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  viewMode,
  onChangeViewMode,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 30 });
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left mouse button when clicking background
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.3), 2.5);

    const rect = containerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    setPan({
      x: cursorX - (cursorX - pan.x) * (newZoom / zoom),
      y: cursorY - (cursorY - pan.y) * (newZoom / zoom),
    });
    setZoom(newZoom);
  };

  const handleResetView = () => {
    setPan({ x: 30, y: 30 });
    setZoom(1.0);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      {/* Background Grid Pattern */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.25,
        }}
      >
        <defs>
          <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#27272a" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Floating View Mode Switcher Header */}
      {onChangeViewMode && viewMode && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 20,
            display: 'flex',
            background: 'var(--bg-card)',
            padding: '3px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => onChangeViewMode('table')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: viewMode === 'table' ? '#27272a' : 'transparent',
              color: viewMode === 'table' ? '#fff' : 'var(--text-secondary)',
              border: viewMode === 'table' ? '1px solid var(--border-focus)' : '1px solid transparent',
              cursor: 'pointer',
            }}
          >
            <Grid size={13} />
            Data Structures
          </button>

          <button
            onClick={() => onChangeViewMode('tree')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: viewMode === 'tree' ? '#27272a' : 'transparent',
              color: viewMode === 'tree' ? '#c084fc' : 'var(--text-secondary)',
              border: viewMode === 'tree' ? '1px solid #a855f7' : '1px solid transparent',
              cursor: 'pointer',
            }}
          >
            <GitBranch size={13} />
            Recursion DAG
          </button>
        </div>
      )}

      {/* Zoom Controls HUD */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'var(--bg-card)',
          padding: '4px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={() => setZoom((z) => Math.min(z * 1.2, 2.5))}
          style={{
            padding: '5px',
            borderRadius: '4px',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>

        <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, padding: '2px 0' }}>
          {Math.round(zoom * 100)}%
        </div>

        <button
          onClick={() => setZoom((z) => Math.max(z * 0.8, 0.3))}
          style={{
            padding: '5px',
            borderRadius: '4px',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={handleResetView}
          style={{
            padding: '5px',
            borderRadius: '4px',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
          title="Reset Zoom & Pan"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Scaled & Panned Content Layer */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.08s ease-out',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};
