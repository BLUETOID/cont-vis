/**
 * Multi-Data-Structure Reactive Canvas
 * Renders active data structures (arrays, matrices, stacks, queues, maps, scalars)
 * Clean, flat, high-performance styling without glow effects
 */

import React from 'react';
import type { DPTraceSnapshot } from '../../types/dp';
import { ArrayWidget } from './ArrayWidget';
import { MatrixWidget } from './MatrixWidget';
import { StackWidget } from './StackWidget';
import { QueueWidget } from './QueueWidget';
import { MapWidget } from './MapWidget';
import { ScalarWatchWidget } from './ScalarWatchWidget';
import { Code, Terminal } from 'lucide-react';

interface DataStructureCanvasProps {
  snapshot?: DPTraceSnapshot;
}

export const DataStructureCanvas: React.FC<DataStructureCanvasProps> = ({ snapshot }) => {
  if (!snapshot) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 30px',
          background: '#111827',
          border: '1px solid #374151',
          borderRadius: '8px',
          maxWidth: '480px',
          textAlign: 'center',
        }}
      >
        <Code size={30} color="#38bdf8" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f3f4f6', marginBottom: '6px' }}>
          Code-Driven Visualizer
        </h3>
        <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.5 }}>
          Write any C++ code or select a template above. Click <strong>Run Code (Ctrl+↵)</strong> to execute and visualize data structures.
        </p>
      </div>
    );
  }

  const arrays = Object.values(snapshot.arrays || {});
  const matrices = Object.values(snapshot.matrices || {});
  const stacks = Object.values(snapshot.stacks || {});
  const queues = Object.values(snapshot.queues || {});
  const maps = Object.values(snapshot.maps || {});
  const scalars = snapshot.scalars || {};

  const totalStructures =
    arrays.length +
    matrices.length +
    stacks.length +
    queues.length +
    maps.length +
    (Object.keys(scalars).length > 0 ? 1 : 0);

  if (totalStructures === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 30px',
          background: '#111827',
          border: '1px solid #374151',
          borderRadius: '8px',
          maxWidth: '480px',
          textAlign: 'center',
        }}
      >
        <Terminal size={30} color="#38bdf8" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f3f4f6', marginBottom: '6px' }}>
          Execution Completed
        </h3>
        <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.5 }}>
          No active data structures were declared in this step.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        maxWidth: '1200px',
      }}
    >
      {/* Top Row: Scalar Watch if available */}
      {Object.keys(scalars).length > 0 && (
        <ScalarWatchWidget scalars={scalars} />
      )}

      {/* Main Grid: Data Structure Cards */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        {/* 1D Arrays */}
        {arrays.map((arr) => (
          <ArrayWidget
            key={arr.name}
            state={arr}
            pointers={snapshot.pointers}
          />
        ))}

        {/* Stacks */}
        {stacks.map((st) => (
          <StackWidget key={st.name} state={st} />
        ))}

        {/* Queues */}
        {queues.map((q) => (
          <QueueWidget key={q.name} state={q} />
        ))}

        {/* Hash Maps */}
        {maps.map((mp) => (
          <MapWidget key={mp.name} state={mp} />
        ))}

        {/* 2D Matrices */}
        {matrices.map((mat) => (
          <MatrixWidget key={mat.name} state={mat} />
        ))}
      </div>
    </div>
  );
};
