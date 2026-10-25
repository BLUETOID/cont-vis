/**
 * Monaco Code Editor Integration with Live Executing Line Decoration
 */

import React, { useRef, useEffect } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Code2, Play } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  activeLine?: number;
  onRun: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChangeCode,
  activeLine,
  onRun,
}) => {
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add Ctrl+Enter or Cmd+Enter keybinding to execute
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
  };

  // Update line highlight decorations when activeLine changes
  useEffect(() => {
    if (!editorRef.current) return;
    const editor = editorRef.current;

    if (activeLine && activeLine > 0) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: {
            startLineNumber: activeLine,
            startColumn: 1,
            endLineNumber: activeLine,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: 'monaco-executing-line',
            glyphMarginClassName: 'monaco-executing-glyph',
          },
        },
      ]);

      // Gently reveal line if out of viewport
      editor.revealLineInCenterIfOutsideViewport(activeLine);
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  }, [activeLine]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Code2 size={15} color="#10b981" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-bright)' }}>
            C++ Solution Source
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            <strong>Ctrl + Enter</strong>
          </span>
          <button
            onClick={onRun}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            title="Run C++ Code (Ctrl + Enter)"
          >
            <Play size={12} fill="#ffffff" />
            Run
          </button>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <Editor
          height="100%"
          defaultLanguage="cpp"
          language="cpp"
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            glyphMargin: true,
            lineNumbersMinChars: 3,
            padding: { top: 8, bottom: 8 },
          }}
        />
      </div>

      <style>{`
        .monaco-executing-line {
          background: rgba(245, 158, 11, 0.2) !important;
          border-left: 3px solid #fbbf24 !important;
        }
        .monaco-executing-glyph {
          background: #fbbf24 !important;
          border-radius: 50%;
          transform: scale(0.6);
        }
      `}</style>
    </div>
  );
};
