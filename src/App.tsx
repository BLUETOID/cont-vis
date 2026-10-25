/**
 * Dynamic Programming & Data Structure Visualizer Studio (dp-vis)
 * Pure, high-performance code-driven visualizer
 * Supports custom stdin (cin >>), step-synchronized stdout (cout <<),
 * separate recursion DAG tab, and crisp flat styling without shadow glow.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/common/Header';
import { Controls } from './components/common/Controls';
import { CanvasViewport } from './components/canvas/CanvasViewport';
import { DataStructureCanvas } from './components/canvas/DataStructureCanvas';
import { RecursionDAGView } from './components/canvas/RecursionDAGView';
import { CallStackPanel } from './components/panels/CallStackPanel';
import { TerminalConsole } from './components/panels/TerminalConsole';
import { StdinInputPanel } from './components/panels/StdinInputPanel';
import { CodeEditor } from './components/editor/CodeEditor';

import { CODE_TEMPLATES, getTemplateById } from './presets/templates';
import type { DPTraceSnapshot } from './types/dp';
import { runCppDPInterpreter } from './core/interpreter';
import { LayoutGrid, GitFork } from 'lucide-react';

export function App() {
  // Preset & Template State
  const defaultTemplate = CODE_TEMPLATES[0]; // Custom Input (cin >>) or 1D Array
  const [currentTemplateId, setCurrentTemplateId] = useState<string>(defaultTemplate.id);
  const [code, setCode] = useState<string>(defaultTemplate.code);
  const [stdin, setStdin] = useState<string>(defaultTemplate.defaultStdin || '');

  // Execution & Trace State
  const [trace, setTrace] = useState<DPTraceSnapshot[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [finalAnswer, setFinalAnswer] = useState<any>(undefined);
  const [stdout, setStdout] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Playback & Tabs
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeLeftTab, setActiveLeftTab] = useState<'input' | 'terminal' | 'callstack'>('terminal');
  const [activeCanvasView, setActiveCanvasView] = useState<'structures' | 'recursion'>('structures');

  // Adjustable Resizable Pane Width
  const [leftWidth, setLeftWidth] = useState<number>(44);
  const [isDraggingDivider, setIsDraggingDivider] = useState<boolean>(false);

  useEffect(() => {
    if (!isDraggingDivider) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newPercent = (e.clientX / window.innerWidth) * 100;
      if (newPercent >= 20 && newPercent <= 80) {
        setLeftWidth(newPercent);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingDivider(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingDivider]);

  // Check if current trace has recursion
  const hasRecursion = useMemo(() => {
    return trace.some((s) => s.recursionTree && Object.keys(s.recursionTree.nodes).length > 1);
  }, [trace]);

  // Only show / take input when code is actually asking for input via cin
  const hasCin = useMemo(() => {
    return /\bcin\s*>>/.test(code) || /\bcin\b/.test(code) || /\bgetline\s*\(/.test(code);
  }, [code]);

  // If code does not use cin, automatically switch away from input tab to terminal
  useEffect(() => {
    if (!hasCin && activeLeftTab === 'input') {
      setActiveLeftTab('terminal');
    }
  }, [hasCin, activeLeftTab]);

  // Switch template
  const handleSelectTemplate = (templateId: string) => {
    setCurrentTemplateId(templateId);
    const tmpl = getTemplateById(templateId);
    if (tmpl) {
      setCode(tmpl.code);
      if (tmpl.defaultStdin !== undefined) {
        setStdin(tmpl.defaultStdin);
      }
    }
  };

  // Run interpreter and generate execution snapshots
  const executeCode = useCallback(() => {
    setIsExecuting(true);
    setIsPlaying(false);

    try {
      const result = runCppDPInterpreter(code, { stdin });

      setTrace(result.trace);
      setStdout(result.stdout);
      setFinalAnswer(result.finalAnswer);
      setCurrentStepIndex(0);

      if (result.error) {
        setStdout((prev) => `${prev ? prev + '\n' : ''}[Interpreter Error]: ${result.error}`);
        setActiveLeftTab('terminal');
      }
    } finally {
      setIsExecuting(false);
    }
  }, [code, stdin]);

  // Execute on initial mount or when code changes from template selection
  useEffect(() => {
    executeCode();
  }, [currentTemplateId]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentStepIndex((prev) => Math.min(trace.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length, executeCode]);

  const currentSnapshot: DPTraceSnapshot | null = trace[currentStepIndex] || null;

  // Step-synchronized stdout (shows stdout up to current execution step)
  const currentStepStdout = currentSnapshot ? currentSnapshot.stdout : stdout;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* 1. Top Navigation Bar */}
      <Header
        currentTemplateId={currentTemplateId}
        onSelectTemplate={handleSelectTemplate}
        onRunCode={executeCode}
        onReset={() => setCurrentStepIndex(0)}
        isExecuting={isExecuting}
        stepCount={trace.length}
        finalAnswer={finalAnswer}
        stdout={stdout}
      />

      {/* 2. Main 2-Pane Workspace with Adjustable Splitter */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Left Column: Monaco Code Editor + Tabs (Input, Output, CallStack) */}
        <div
          style={{
            width: `${leftWidth}%`,
            minWidth: '320px',
            maxWidth: '75%',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-secondary)',
            overflow: 'hidden',
          }}
        >
          {/* Top 62%: Monaco Editor */}
          <div style={{ flex: '1 1 60%', minHeight: '240px' }}>
            <CodeEditor
              code={code}
              onChangeCode={setCode}
              activeLine={currentSnapshot?.line}
              onRun={executeCode}
            />
          </div>

          {/* Bottom 38%: Tabbed Panels (Input, Output, Call Stack) */}
          <div
            style={{
              flex: '1 1 40%',
              minHeight: '170px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-primary)',
            }}
          >
            {/* Tabs Header */}
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '0 8px',
              }}
            >
              {hasCin && (
                <button
                  onClick={() => setActiveLeftTab('input')}
                  style={{
                    padding: '7px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderBottom: activeLeftTab === 'input' ? '2px solid #10b981' : '2px solid transparent',
                    color: activeLeftTab === 'input' ? '#34d399' : 'var(--text-secondary)',
                    background: 'transparent',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Input (cin)
                </button>
              )}
              <button
                onClick={() => setActiveLeftTab('terminal')}
                style={{
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderBottom: activeLeftTab === 'terminal' ? '2px solid #10b981' : '2px solid transparent',
                  color: activeLeftTab === 'terminal' ? '#34d399' : 'var(--text-secondary)',
                  background: 'transparent',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                }}
              >
                Terminal Output
              </button>
              <button
                onClick={() => setActiveLeftTab('callstack')}
                style={{
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderBottom: activeLeftTab === 'callstack' ? '2px solid #a855f7' : '2px solid transparent',
                  color: activeLeftTab === 'callstack' ? '#c084fc' : 'var(--text-secondary)',
                  background: 'transparent',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                }}
              >
                Call Stack ({currentSnapshot?.callStack.length || 0})
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflow: 'hidden', padding: '8px' }}>
              {activeLeftTab === 'input' && (
                <StdinInputPanel
                  stdin={stdin}
                  onChangeStdin={setStdin}
                  onApply={executeCode}
                />
              )}
              {activeLeftTab === 'terminal' && (
                <TerminalConsole
                  stdout={currentStepStdout}
                  onClear={() => setStdout('')}
                />
              )}
              {activeLeftTab === 'callstack' && (
                <CallStackPanel callStack={currentSnapshot?.callStack || []} />
              )}
            </div>
          </div>
        </div>

        {/* Adjustable Splitter Divider */}
        <div
          onMouseDown={() => setIsDraggingDivider(true)}
          style={{
            width: '6px',
            cursor: 'col-resize',
            background: isDraggingDivider ? '#10b981' : 'var(--border-subtle)',
            transition: 'background 0.15s ease',
            position: 'relative',
            zIndex: 30,
            userSelect: 'none',
          }}
          title="Drag to resize editor and visualizer panels"
        />

        {/* Right Column: Infinite Vector Canvas with Optional Recursion Tab */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg-primary)', overflow: 'hidden' }}>
          {/* Top Switcher Bar (Only shown when code has recursive calls) */}
          {hasRecursion && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '6px 16px',
                zIndex: 10,
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>View:</span>
              <button
                onClick={() => setActiveCanvasView('structures')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: activeCanvasView === 'structures' ? 'var(--bg-card-hover)' : 'transparent',
                  color: activeCanvasView === 'structures' ? 'var(--text-bright)' : 'var(--text-secondary)',
                  border: '1px solid ' + (activeCanvasView === 'structures' ? 'var(--border-focus)' : 'var(--border-subtle)'),
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <LayoutGrid size={12} />
                Data Structures
              </button>
              <button
                onClick={() => setActiveCanvasView('recursion')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: activeCanvasView === 'recursion' ? 'var(--bg-card-hover)' : 'transparent',
                  color: activeCanvasView === 'recursion' ? '#c084fc' : 'var(--text-secondary)',
                  border: '1px solid ' + (activeCanvasView === 'recursion' ? '#a855f7' : 'var(--border-subtle)'),
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <GitFork size={12} />
                Recursion Call Tree
              </button>
            </div>
          )}

          <CanvasViewport>
            {activeCanvasView === 'recursion' && hasRecursion ? (
              <div style={{ padding: '20px' }}>
                <RecursionDAGView tree={currentSnapshot?.recursionTree || null} />
              </div>
            ) : (
              <DataStructureCanvas snapshot={currentSnapshot || undefined} />
            )}
          </CanvasViewport>
        </div>
      </div>

      {/* 3. Bottom Time-Travel Debugger Controls */}
      <Controls
        trace={trace}
        currentStepIndex={currentStepIndex}
        onSelectStep={setCurrentStepIndex}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={setPlaybackSpeed}
      />
    </div>
  );
}

export default App;
