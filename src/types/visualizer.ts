/**
 * Pure Code Data Structure Visualizer Type Definitions
 * Supports 1D Arrays, 2D Matrices, Stacks, Queues, Hash Maps, Pointers, and Recursion
 */

import type { CallStackFrame, DPTableState, RecursionTreeState, LiveFormula, BacktrackStep, DPPhase } from './dp';

export interface ArrayVisualState {
  name: string;
  values: any[];
  activeIndices: number[];
  readIndices: number[];
}

export interface MatrixVisualState {
  name: string;
  rows: number;
  cols: number;
  values: any[][];
  activeCell?: { r: number; c: number };
  readCells?: { r: number; c: number }[];
}

export interface StackVisualState {
  name: string;
  items: any[];
  topIndex: number;
  lastAction?: 'push' | 'pop' | 'top' | 'idle';
}

export interface QueueVisualState {
  name: string;
  items: any[];
  lastAction?: 'push' | 'pop' | 'front' | 'idle';
}

export interface MapVisualState {
  name: string;
  entries: [any, any][];
  activeKey?: any;
}

export interface PointerVisualState {
  name: string;
  value: number;
  targetDataStructure?: string;
}

export type ScalarVariables = Record<string, string | number | boolean>;

export interface ExecutionSnapshot {
  step: number;
  line: number;
  phase: DPPhase;
  explanation: string;
  callStack: CallStackFrame[];
  dpTable: DPTableState | null;
  recursionTree: RecursionTreeState | null;
  formula: LiveFormula | null;
  backtrackStep: BacktrackStep | null;
  stdout: string;

  // Visualizer Components
  arrays: Record<string, ArrayVisualState>;
  matrices: Record<string, MatrixVisualState>;
  stacks: Record<string, StackVisualState>;
  queues: Record<string, QueueVisualState>;
  maps: Record<string, MapVisualState>;
  pointers: Record<string, PointerVisualState>;
  scalars: ScalarVariables;
}

export interface ExecutionResult {
  trace: ExecutionSnapshot[];
  stdout: string;
  finalAnswer?: any;
  error?: string;
  errorLine?: number;
}
