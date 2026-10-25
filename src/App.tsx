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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#0a0f1d', color: '#f8fafc' }}>
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

      {/* 2. Main 2-Pane Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Column: Monaco Code Editor + Tabs (Input, Output, CallStack) (42% width) */}
        <div
          style={{
            width: '42%',
            minWidth: '380px',
            borderRight: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            background: '#0d1527',
          }}
        >
          {/* Top 62%: Monaco Editor */}
          <div style={{ flex: '1 1 62%', minHeight: '260px' }}>
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
              flex: '1 1 38%',
              minHeight: '170px',
              borderTop: '1px solid #1e293b',
              display: 'flex',
              flexDirection: 'column',
              background: '#0a0f1d',
            }}
          >
            {/* Tabs Header */}
            <div
              style={{
                display: 'flex',
                background: '#111827',
                borderBottom: '1px solid #1e293b',
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
                    borderBottom: activeLeftTab === 'input' ? '2px solid #38bdf8' : 'none',
                    color: activeLeftTab === 'input' ? '#38bdf8' : '#94a3b8',
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
                  borderBottom: activeLeftTab === 'terminal' ? '2px solid #34d399' : 'none',
                  color: activeLeftTab === 'terminal' ? '#34d399' : '#94a3b8',
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
                  borderBottom: activeLeftTab === 'callstack' ? '2px solid #3b82f6' : 'none',
                  color: activeLeftTab === 'callstack' ? '#60a5fa' : '#94a3b8',
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

        {/* Right Column: Infinite Vector Canvas with Optional Recursion Tab (58% width) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Top Switcher Bar (Only shown when code has recursive calls) */}
          {hasRecursion && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#111827',
                borderBottom: '1px solid #1e293b',
                padding: '6px 16px',
                zIndex: 10,
              }}
            >
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>View:</span>
              <button
                onClick={() => setActiveCanvasView('structures')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: activeCanvasView === 'structures' ? '#1e293b' : 'transparent',
                  color: activeCanvasView === 'structures' ? '#38bdf8' : '#94a3b8',
                  border: '1px solid ' + (activeCanvasView === 'structures' ? '#38bdf8' : '#334155'),
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
                  background: activeCanvasView === 'recursion' ? '#1e293b' : 'transparent',
                  color: activeCanvasView === 'recursion' ? '#a78bfa' : '#94a3b8',
                  border: '1px solid ' + (activeCanvasView === 'recursion' ? '#8b5cf6' : '#334155'),
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
