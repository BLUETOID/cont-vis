/**
 * Dynamic Programming State & Visualization Type Definitions
 */

export interface DPPosition {
  row: number;
  col: number;
  label?: string;
}

export interface DPActiveCell {
  row: number;
  col: number;
  prevVal?: number | string | null;
  newVal: number | string;
  isBaseCase?: boolean;
}

export interface DPTableState {
  name: string;
  dimensions: 1 | 2;
  rows: number;
  cols: number;
  rowLabels: string[];
  colLabels: string[];
  rowHeaderTitle?: string;
  colHeaderTitle?: string;
  values: (number | string | null)[][];
  activeCell: DPActiveCell | null;
  readDependencies: DPPosition[];
  backtrackPath: DPPosition[];
}

export interface RecursionNode {
  id: string;
  name: string;
  args: Record<string, any>;
  returnValue?: any;
  status: 'active' | 'returning' | 'memo_hit' | 'done';
  cachedFromId?: string;
  parentId?: string;
  childIds: string[];
  depth: number;
  x?: number;
  y?: number;
  width?: number;
}

export interface RecursionTreeState {
  nodes: Record<string, RecursionNode>;
  rootId?: string;
  activeNodeId?: string;
}

export interface LiveFormula {
  template: string;
  substituted: string;
  decision?: string;
  resultValue?: number | string;
}

export interface BacktrackStep {
  currentCell: DPPosition;
  decisionExplanation: string;
  solutionItems: string[];
  runningMetric?: string | number;
}

export interface CallStackFrame {
  name: string;
  args: Record<string, any>;
  locals: Record<string, any>;
  line: number;
}

export type DPPhase = 'init' | 'compute' | 'memo_hit' | 'backtrack' | 'complete';

export interface DPTraceSnapshot {
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

  // Rich General-Purpose Visualizer components
  arrays?: Record<string, { name: string; values: any[]; activeIndices: number[]; readIndices: number[] }>;
  matrices?: Record<string, { name: string; rows: number; cols: number; values: any[][]; activeCell?: { r: number; c: number }; readCells?: { r: number; c: number }[] }>;
  stacks?: Record<string, { name: string; items: any[]; topIndex: number; lastAction?: 'push' | 'pop' | 'top' | 'idle' }>;
  queues?: Record<string, { name: string; items: any[]; lastAction?: 'push' | 'pop' | 'front' | 'idle' }>;
  maps?: Record<string, { name: string; entries: [any, any][]; activeKey?: any }>;
  pointers?: Record<string, { name: string; value: number; targetDataStructure?: string }>;
  scalars?: Record<string, string | number | boolean>;
}

export interface DPExecutionResult {
  trace: DPTraceSnapshot[];
  stdout: string;
  finalAnswer?: number | string;
  error?: string;
  errorLine?: number;
}
