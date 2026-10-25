/**
 * Time-Travel Playback Controls & Timeline Scrubber
 */

import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Gauge,
} from 'lucide-react';
import type { DPTraceSnapshot } from '../../types/dp';

interface ControlsProps {
  trace: DPTraceSnapshot[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  trace,
  currentStepIndex,
  onSelectStep,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
}) => {
  const totalSteps = trace.length;
  const currentSnapshot = trace[currentStepIndex];

  // Auto-play animation timer
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= totalSteps - 1) {
      onTogglePlay();
      return;
    }

    const interval = setInterval(() => {
      onSelectStep(Math.min(currentStepIndex + 1, totalSteps - 1));
    }, 600 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed, onTogglePlay, onSelectStep]);

  const getPhaseBadge = (phase?: string) => {
    switch (phase) {
      case 'init':
        return <span className="badge badge-amber">Init & Base Cases</span>;
      case 'memo_hit':
        return <span className="badge badge-emerald pulse-memo">★ Memo Cache Hit</span>;
      case 'compute':
        return <span className="badge badge-violet">State Computation</span>;
      case 'complete':
        return <span className="badge badge-cyan">✓ Complete</span>;
      default:
        return <span className="badge badge-violet">Stepping</span>;
    }
  };

  return (
    <footer
      style={{
        height: 'var(--controls-height)',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: '20px',
        zIndex: 90,
      }}
    >
      {/* Playback Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => onSelectStep(0)}
          disabled={currentStepIndex === 0 || totalSteps === 0}
          className="btn-secondary"
          title="Jump to Start"
          style={{ padding: '6px 8px' }}
        >
          <SkipBack size={16} />
        </button>

        <button
          onClick={() => onSelectStep(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex === 0 || totalSteps === 0}
          className="btn-secondary"
          title="Previous Step (Left Arrow)"
          style={{ padding: '6px 8px' }}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={onTogglePlay}
          disabled={totalSteps === 0}
          className="btn-primary"
          style={{
            padding: '6px 16px',
            minWidth: '90px',
            justifyContent: 'center',
          }}
          title="Play / Pause (Spacebar)"
        >
          {isPlaying ? (
            <>
              <Pause size={16} /> Pause
            </>
          ) : (
            <>
              <Play size={16} fill="#fff" /> Play
            </>
          )}
        </button>

        <button
          onClick={() => onSelectStep(Math.min(totalSteps - 1, currentStepIndex + 1))}
          disabled={currentStepIndex >= totalSteps - 1 || totalSteps === 0}
          className="btn-secondary"
          title="Next Step (Right Arrow)"
          style={{ padding: '6px 8px' }}
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => onSelectStep(totalSteps - 1)}
          disabled={currentStepIndex >= totalSteps - 1 || totalSteps === 0}
          className="btn-secondary"
          title="Jump to Final Solution"
          style={{ padding: '6px 8px' }}
        >
          <SkipForward size={16} />
        </button>
      </div>

      {/* Scrubber Slider & Step Status */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '650px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
            </span>
            {currentSnapshot && getPhaseBadge(currentSnapshot.phase)}
          </div>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '350px',
            }}
            title={currentSnapshot?.explanation}
          >
            {currentSnapshot?.explanation || 'Ready to run.'}
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onSelectStep(Number(e.target.value))}
          disabled={totalSteps <= 1}
          style={{
            width: '100%',
            height: '6px',
            accentColor: 'var(--accent-emerald)',
            cursor: totalSteps > 1 ? 'pointer' : 'default',
          }}
        />
      </div>

      {/* Speed Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Gauge size={16} color="var(--text-muted)" />
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Speed:</span>
        <select
          value={playbackSpeed}
          onChange={(e) => onChangeSpeed(Number(e.target.value))}
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1.0x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2.0x</option>
          <option value={4}>4.0x</option>
        </select>
      </div>
    </footer>
  );
};
