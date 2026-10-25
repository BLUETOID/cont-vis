/**
 * Virtual Machine Evaluator with DP State, Lexical Scoping, and Multi-Data-Structure Sniffer
 */

import type {
  BaseASTNode,
  ProgramNode,
  FunctionDeclNode,
  VariableDeclNode,
  IfStatementNode,
  WhileStatementNode,
  ForStatementNode,
  RangeForStatementNode,
  ReturnStatementNode,
  AssignmentStatementNode,
  CompoundAssignmentStatementNode,
  IndexAssignmentStatementNode,
  MemberAssignmentStatementNode,
  TieAssignmentStatementNode,
  ExpressionStatementNode,
  BlockStatementNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  UpdateExpressionNode,
  CallExpressionNode,
  MemberCallExpressionNode,
  MemberAccessExpressionNode,
  IndexAccessExpressionNode,
  ConditionalExpressionNode,
  IdentifierNode,
  LiteralNode,
  ArrayLiteralNode,
} from './ast';

import type {
  DPTraceSnapshot,
  DPTableState,
  RecursionNode,
  DPPosition,
  CallStackFrame,
  LiveFormula,
  DPPhase,
} from '../../types/dp';

class ReturnValue {
  public value: any;
  constructor(value: any) {
    this.value = value;
  }
}

class BreakSignal {}
class ContinueSignal {}

export class CppStack {
  public items: any[] = [];
  public lastAction: 'push' | 'pop' | 'top' | 'idle' = 'idle';

  public push(val: any): void {
    this.items.push(val);
    this.lastAction = 'push';
  }
  public pop(): any {
    this.lastAction = 'pop';
    return this.items.pop();
  }
  public top(): any {
    this.lastAction = 'top';
    return this.items[this.items.length - 1];
  }
  public empty(): boolean {
    return this.items.length === 0;
  }
  public size(): number {
    return this.items.length;
  }
  public clear(): void {
    this.items = [];
    this.lastAction = 'idle';
  }
}

export class CppQueue {
  public items: any[] = [];
  public lastAction: 'push' | 'pop' | 'front' | 'idle' = 'idle';

  public push(val: any): void {
    this.items.push(val);
    this.lastAction = 'push';
  }
  public pop(): any {
    this.lastAction = 'pop';
    return this.items.shift();
  }
  public front(): any {
    this.lastAction = 'front';
    return this.items[0];
  }
  public back(): any {
    return this.items[this.items.length - 1];
  }
  public empty(): boolean {
    return this.items.length === 0;
  }
  public size(): number {
    return this.items.length;
  }
  public clear(): void {
    this.items = [];
    this.lastAction = 'idle';
  }
}

export class CppMap {
  public data: Map<any, any> = new Map();
  public activeKey: any = undefined;

  public get(key: any): any {
    return this.data.get(key) ?? 0;
  }
  public set(key: any, val: any): void {
    this.activeKey = key;
    this.data.set(key, val);
  }
  public has(key: any): boolean {
    return this.data.has(key);
  }
  public count(key: any): number {
    return this.data.has(key) ? 1 : 0;
  }
  public size(): number {
    return this.data.size;
  }
  public entries(): [any, any][] {
    return Array.from(this.data.entries());
  }
}

export class CppPriorityQueue {
  public items: any[] = [];
  public isMinHeap: boolean = false;
  public lastAction: 'push' | 'pop' | 'top' | 'idle' = 'idle';

  constructor(isMinHeap: boolean = false) {
    this.isMinHeap = isMinHeap;
  }

  public push(val: any): void {
    this.items.push(val);
    this.sort();
    this.lastAction = 'push';
  }

  public emplace(...args: any[]): void {
    this.push(args.length === 1 ? args[0] : args);
  }

  public pop(): any {
    this.lastAction = 'pop';
    return this.items.shift();
  }

  public top(): any {
    this.lastAction = 'top';
    return this.items[0];
  }

  public empty(): boolean {
    return this.items.length === 0;
  }

  public size(): number {
    return this.items.length;
  }

  public clear(): void {
    this.items = [];
    this.lastAction = 'idle';
  }

  private sort(): void {
    this.items.sort((a, b) => {
      const va = Array.isArray(a) ? a[0] : a;
      const vb = Array.isArray(b) ? b[0] : b;
      if (this.isMinHeap) {
        return va < vb ? -1 : va > vb ? 1 : 0;
      } else {
        return va > vb ? -1 : va < vb ? 1 : 0;
      }
    });
  }
}

export class CppDeque {
  public items: any[] = [];
  public lastAction: string = 'idle';

  public push_back(val: any): void {
    this.items.push(val);
    this.lastAction = 'push_back';
  }
  public emplace_back(...args: any[]): void {
    this.push_back(args.length === 1 ? args[0] : args);
  }
  public push_front(val: any): void {
    this.items.unshift(val);
    this.lastAction = 'push_front';
  }
  public emplace_front(...args: any[]): void {
    this.push_front(args.length === 1 ? args[0] : args);
  }
  public pop_back(): any {
    this.lastAction = 'pop_back';
    return this.items.pop();
  }
  public pop_front(): any {
    this.lastAction = 'pop_front';
    return this.items.shift();
  }
  public front(): any {
    return this.items[0];
  }
  public back(): any {
    return this.items[this.items.length - 1];
  }
  public empty(): boolean {
    return this.items.length === 0;
  }
  public size(): number {
    return this.items.length;
  }
  public clear(): void {
    this.items = [];
  }
}

export class CppSet {
  public data: Set<any> = new Set();
  public isMulti: boolean = false;
  public multiItems: any[] = [];

  constructor(isMulti: boolean = false) {
    this.isMulti = isMulti;
  }

  public insert(val: any): void {
    if (this.isMulti) {
      this.multiItems.push(val);
      this.multiItems.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    } else {
      this.data.add(val);
    }
  }

  public emplace(...args: any[]): void {
    this.insert(args.length === 1 ? args[0] : args);
  }

  public count(val: any): number {
    if (this.isMulti) {
      return this.multiItems.filter((x) => x === val).length;
    }
    return this.data.has(val) ? 1 : 0;
  }

  public erase(val: any): void {
    if (this.isMulti) {
      this.multiItems = this.multiItems.filter((x) => x !== val);
    } else {
      this.data.delete(val);
    }
  }

  public size(): number {
    return this.isMulti ? this.multiItems.length : this.data.size;
  }

  public empty(): boolean {
    return this.size() === 0;
  }

  public clear(): void {
    this.data.clear();
    this.multiItems = [];
  }

  public toArray(): any[] {
    if (this.isMulti) return [...this.multiItems];
    return Array.from(this.data).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function popcount(x: number): number {
  let count = 0;
  let n = BigInt(Math.floor(x));
  if (n < 0n) n = BigInt.asUintN(64, n);
  while (n > 0n) {
    if (n & 1n) count++;
    n >>= 1n;
  }
  return count;
}

export class Scope {
  public values: Map<string, any> = new Map();
  public parent?: Scope;

  constructor(parent?: Scope) {
    this.parent = parent;
  }

  public has(name: string): boolean {
    if (this.values.has(name)) return true;
    return this.parent ? this.parent.has(name) : false;
  }

  public get(name: string): any {
    if (name === 'endl') return '\n';
    if (name === 'cout') return 'cout';
    if (name === 'cin') return 'cin';
    if (this.values.has(name)) return this.values.get(name);
    return this.parent ? this.parent.get(name) : undefined;
  }

  public set(name: string, val: any): void {
    if (this.values.has(name)) {
      this.values.set(name, val);
      return;
    }
    if (this.parent && this.parent.has(name)) {
      this.parent.set(name, val);
      return;
    }
    this.values.set(name, val);
  }

  public declare(name: string, val: any): void {
    this.values.set(name, val);
  }

  public getAllVariables(): Map<string, any> {
    const map = new Map<string, any>();
    if (this.parent) {
      const parentVars = this.parent.getAllVariables();
      for (const [k, v] of parentVars.entries()) {
        map.set(k, v);
      }
    }
    for (const [k, v] of this.values.entries()) {
      map.set(k, v);
    }
    return map;
  }
}

export interface EvaluatorOptions {
  rowLabels?: string[];
  colLabels?: string[];
  rowHeaderTitle?: string;
  colHeaderTitle?: string;
  formulaTemplate?: string;
  stdin?: string;
}

export class Evaluator {
  private program: ProgramNode;
  private functions: Map<string, FunctionDeclNode> = new Map();
  private globalScope: Scope = new Scope();
  private activeScope?: Scope;
  private callStack: CallStackFrame[] = [];

  // DP State tracking
  private dpTableName: string = 'dp';
  private dpDimensions: 1 | 2 = 2;
  private dpTableValues: (number | string | null)[][] = [];
  private currentReadDependencies: DPPosition[] = [];
  private memoLookupHistory: Map<string, string> = new Map(); // key -> nodeId

  // Recursion Tree tracking
  private recursionNodes: Record<string, RecursionNode> = {};
  private recursionIdCounter: number = 1;
  private currentRecursionNodeId?: string;

  // Stdin & Execution Trace
  private stdinTokens: string[] = [];
  private stdinIndex: number = 0;
  private trace: DPTraceSnapshot[] = [];
  private stdout: string = '';
  private stepCount: number = 0;
  private readonly MAX_STEPS: number = 20000;

  // Display Options
  private rowLabels: string[] = [];
  private colLabels: string[] = [];
  private rowHeaderTitle?: string;
  private colHeaderTitle?: string;
  private formulaTemplate: string = '';

  constructor(program: ProgramNode, options: EvaluatorOptions = {}) {
    this.program = program;
    this.rowLabels = options.rowLabels || [];
    this.colLabels = options.colLabels || [];
    this.rowHeaderTitle = options.rowHeaderTitle;
    this.colHeaderTitle = options.colHeaderTitle;
    this.formulaTemplate = options.formulaTemplate || '';
    if (options.stdin !== undefined) {
      this.stdinTokens = options.stdin.trim().split(/\s+/).filter(Boolean);
    }
  }

  private readNextStdin(): any {
    if (this.stdinIndex >= this.stdinTokens.length) {
      return 0;
    }
    const token = this.stdinTokens[this.stdinIndex++];
    const num = Number(token);
    return isNaN(num) ? token : num;
  }

  public run(): { trace: DPTraceSnapshot[]; stdout: string; finalAnswer?: any; error?: string } {
    try {
      this.activeScope = this.globalScope;

      // Step 1: Hoist functions
      for (const node of this.program.body) {
        if (node.type === 'FunctionDeclaration') {
          const fn = node as FunctionDeclNode;
          this.functions.set(fn.name, fn);
        }
      }

      // Step 2: Run global statements
      for (const node of this.program.body) {
        if (node.type !== 'FunctionDeclaration') {
          this.executeStatement(node, this.globalScope);
        }
      }

      // Step 3: Check for main function or entry function
      const mainFn = this.functions.get('main');
      let finalAnswer: any;

      if (mainFn) {
        finalAnswer = this.invokeFunction(mainFn, [], null);
      } else {
        const otherFns = Array.from(this.functions.values());
        if (otherFns.length > 0) {
          finalAnswer = this.invokeFunction(otherFns[0], [], null);
        }
      }

      return {
        trace: this.trace,
        stdout: this.stdout,
        finalAnswer,
      };
    } catch (e: any) {
      return {
        trace: this.trace,
        stdout: this.stdout,
        error: e.message || String(e),
      };
    }
  }

  private recordStep(
    line: number,
    phase: DPPhase,
    explanation: string,
    activeCell: { row: number; col: number; prevVal?: any; newVal: any; isBaseCase?: boolean } | null = null,
    formula: LiveFormula | null = null
  ) {
    if (this.stepCount >= this.MAX_STEPS) {
      throw new Error(`Execution step limit exceeded (${this.MAX_STEPS} steps). Possible infinite loop.`);
    }

    const allVars = this.activeScope ? this.activeScope.getAllVariables() : this.globalScope.getAllVariables();

    const arrays: Record<string, { name: string; values: any[]; activeIndices: number[]; readIndices: number[] }> = {};
    const matrices: Record<string, { name: string; rows: number; cols: number; values: any[][]; activeCell?: { r: number; c: number }; readCells?: { r: number; c: number }[] }> = {};
    const stacks: Record<string, { name: string; items: any[]; topIndex: number; lastAction?: 'push' | 'pop' | 'top' | 'idle' }> = {};
    const queues: Record<string, { name: string; items: any[]; lastAction?: 'push' | 'pop' | 'front' | 'idle' }> = {};
    const maps: Record<string, { name: string; entries: [any, any][]; activeKey?: any }> = {};
    const pointers: Record<string, { name: string; value: number; targetDataStructure?: string }> = {};
    const scalars: Record<string, string | number | boolean> = {};

    const POINTER_NAMES = new Set(['i', 'j', 'k', 'p', 'idx', 'index', 'left', 'right', 'mid', 'low', 'high', 'l', 'r', 'top', 'front', 'start', 'end', 'cur', 'curr']);

    for (const [varName, val] of allVars.entries()) {
      if (['cout', 'cin', 'endl'].includes(varName) || val === undefined) continue;

      if (val instanceof CppPriorityQueue) {
        queues[varName] = {
          name: `${varName} (${val.isMinHeap ? 'min-pq' : 'max-pq'})`,
          items: [...val.items],
          lastAction: val.lastAction as any,
        };
      } else if (val instanceof CppStack) {
        stacks[varName] = {
          name: varName,
          items: [...val.items],
          topIndex: val.items.length - 1,
          lastAction: val.lastAction,
        };
      } else if (val instanceof CppDeque) {
        queues[varName] = {
          name: `${varName} (deque)`,
          items: [...val.items],
          lastAction: (val.lastAction.includes('front') ? 'front' : 'push') as any,
        };
      } else if (val instanceof CppQueue) {
        queues[varName] = {
          name: varName,
          items: [...val.items],
          lastAction: val.lastAction,
        };
      } else if (val instanceof CppSet) {
        arrays[varName] = {
          name: `${varName} (${val.isMulti ? 'multiset' : 'set'})`,
          values: val.toArray(),
          activeIndices: [],
          readIndices: [],
        };
      } else if (val instanceof CppMap) {
        maps[varName] = {
          name: varName,
          entries: val.entries(),
          activeKey: val.activeKey,
        };
      } else if (Array.isArray(val)) {
        if (val.length > 0 && Array.isArray(val[0])) {
          // 2D Matrix
          const rows = val.length;
          const cols = val[0]?.length || 0;
          matrices[varName] = {
            name: varName,
            rows,
            cols,
            values: val.map((row) => (Array.isArray(row) ? [...row] : [row])),
            activeCell: activeCell ? { r: activeCell.row, c: activeCell.col } : undefined,
            readCells: this.currentReadDependencies.map((d) => ({ r: d.row, c: d.col })),
          };
        } else {
          // 1D Array
          const actIdxs = activeCell ? [activeCell.col] : [];
          const rdIdxs = this.currentReadDependencies.map((d) => d.col);
          arrays[varName] = {
            name: varName,
            values: [...val],
            activeIndices: actIdxs,
            readIndices: rdIdxs,
          };
        }
      } else if (typeof val === 'number') {
        if (POINTER_NAMES.has(varName.toLowerCase())) {
          pointers[varName] = {
            name: varName,
            value: val,
          };
        } else {
          scalars[varName] = val;
        }
      } else if (typeof val === 'string' || typeof val === 'boolean') {
        scalars[varName] = val;
      }
    }

    // Ensure DP table is initialized
    let dpTableState: DPTableState | null = null;
    if (this.dpTableValues.length > 0) {
      const rows = this.dpTableValues.length;
      const cols = rows > 0 ? (Array.isArray(this.dpTableValues[0]) ? this.dpTableValues[0].length : 1) : 0;

      const actualRowLabels = [...this.rowLabels];
      while (actualRowLabels.length < rows) {
        actualRowLabels.push(`i = ${actualRowLabels.length}`);
      }
      const actualColLabels = [...this.colLabels];
      while (actualColLabels.length < cols) {
        actualColLabels.push(`j = ${actualColLabels.length}`);
      }

      dpTableState = {
        name: this.dpTableName,
        dimensions: this.dpDimensions,
        rows,
        cols,
        rowLabels: actualRowLabels.slice(0, rows),
        colLabels: actualColLabels.slice(0, cols),
        rowHeaderTitle: this.rowHeaderTitle,
        colHeaderTitle: this.colHeaderTitle,
        values: this.dpTableValues.map((row) => (Array.isArray(row) ? [...row] : [row])),
        activeCell,
        readDependencies: [...this.currentReadDependencies],
        backtrackPath: [],
      };
    } else if (Object.keys(matrices).length > 0) {
      const firstMatrix = Object.values(matrices)[0];
      dpTableState = {
        name: firstMatrix.name,
        dimensions: 2,
        rows: firstMatrix.rows,
        cols: firstMatrix.cols,
        rowLabels: Array.from({ length: firstMatrix.rows }, (_, idx) => `i = ${idx}`),
        colLabels: Array.from({ length: firstMatrix.cols }, (_, idx) => `j = ${idx}`),
        values: firstMatrix.values,
        activeCell,
        readDependencies: [...this.currentReadDependencies],
        backtrackPath: [],
      };
    } else if (Object.keys(arrays).length > 0) {
      const firstArray = Object.values(arrays)[0];
      dpTableState = {
        name: firstArray.name,
        dimensions: 1,
        rows: 1,
        cols: firstArray.values.length,
        rowLabels: ['dp'],
        colLabels: Array.from({ length: firstArray.values.length }, (_, idx) => `${idx}`),
        values: [firstArray.values],
        activeCell,
        readDependencies: [...this.currentReadDependencies],
        backtrackPath: [],
      };
    }

    const snapshot: DPTraceSnapshot = {
      step: ++this.stepCount,
      line,
      phase,
      explanation,
      callStack: this.cloneCallStack(),
      dpTable: dpTableState,
      recursionTree: {
        nodes: JSON.parse(JSON.stringify(this.recursionNodes)),
        activeNodeId: this.currentRecursionNodeId,
      },
      formula,
      backtrackStep: null,
      stdout: this.stdout,
      arrays,
      matrices,
      stacks,
      queues,
      maps,
      pointers,
      scalars,
    };

    this.trace.push(snapshot);
  }

  private cloneCallStack(): CallStackFrame[] {
    return this.callStack.map((f) => ({
      name: f.name,
      args: { ...f.args },
      locals: { ...f.locals },
      line: f.line,
    }));
  }

  private executeStatement(stmt: BaseASTNode, scope: Scope): void {
    this.activeScope = scope;

    switch (stmt.type) {
      case 'BlockStatement': {
        const block = stmt as BlockStatementNode;
        const innerScope = new Scope(scope);
        for (const s of block.body) {
          this.executeStatement(s, innerScope);
        }
        break;
      }

      case 'VariableDeclaration': {
        const decl = stmt as VariableDeclNode;
        const varType = decl.varType || '';

        // Structured binding declaration: auto [u, v] = pair_val;
        if (decl.bindings && decl.bindings.length > 0) {
          const initVal = decl.initializer ? this.evaluateExpression(decl.initializer, scope) : null;
          if (Array.isArray(initVal)) {
            decl.bindings.forEach((bName, idx) => {
              scope.declare(bName, initVal[idx]);
            });
            this.recordStep(
              stmt.line,
              'init',
              `Structured binding [${decl.bindings.join(', ')}] = [${initVal.join(', ')}]`
            );
          }
          break;
        }

        for (const item of decl.declarations || [decl]) {
          let initVal: any = null;

          if (varType.startsWith('stack')) {
            initVal = new CppStack();
          } else if (varType.startsWith('priority_queue')) {
            initVal = new CppPriorityQueue(varType.includes('greater'));
          } else if (varType.startsWith('deque')) {
            initVal = new CppDeque();
          } else if (varType.startsWith('queue')) {
            initVal = new CppQueue();
          } else if (varType.startsWith('set') || varType.startsWith('unordered_set') || varType.startsWith('multiset')) {
            initVal = new CppSet(varType.startsWith('multiset'));
          } else if (varType.startsWith('map') || varType.startsWith('unordered_map')) {
            initVal = new CppMap();
          } else if (varType.startsWith('pair')) {
            if (item.initializer) {
              initVal = this.evaluateExpression(item.initializer, scope);
            } else if (item.constructorArgs && item.constructorArgs.length >= 2) {
              initVal = [
                this.evaluateExpression(item.constructorArgs[0], scope),
                this.evaluateExpression(item.constructorArgs[1], scope),
              ];
            } else {
              initVal = [0, 0];
            }
          } else if (item.constructorArgs && item.constructorArgs.length > 0) {
            const size = this.evaluateExpression(item.constructorArgs[0], scope);
            const defaultElem =
              item.constructorArgs.length > 1
                ? this.evaluateExpression(item.constructorArgs[1], scope)
                : 0;

            if (Array.isArray(defaultElem)) {
              initVal = Array.from({ length: Number(size) }, () => [...defaultElem]);
            } else {
              initVal = Array.from({ length: Number(size) }, () => defaultElem);
            }
          } else if (item.dimSizes && item.dimSizes.length > 0) {
            const dim1 = Number(this.evaluateExpression(item.dimSizes[0], scope));
            if (item.dimSizes.length > 1) {
              const dim2 = Number(this.evaluateExpression(item.dimSizes[1], scope));
              initVal = Array.from({ length: dim1 }, () => Array.from({ length: dim2 }, () => 0));
            } else {
              initVal = Array.from({ length: dim1 }, () => 0);
            }
          } else if (item.initializer) {
            initVal = this.evaluateExpression(item.initializer, scope);
          } else if (item.isArray || varType.startsWith('vector')) {
            initVal = [];
          } else {
            if (varType.startsWith('bool')) {
              initVal = false;
            } else if (varType.startsWith('string')) {
              initVal = '';
            } else {
              initVal = 0;
            }
          }

          scope.declare(item.name, initVal);

          // Detect if this is the primary DP table
          const isDpName = ['dp', 'memo', 'table', 'opt'].includes(item.name.toLowerCase());
          if (isDpName && Array.isArray(initVal)) {
            this.dpTableName = item.name;
            if (initVal.length > 0 && Array.isArray(initVal[0])) {
              this.dpDimensions = 2;
              this.dpTableValues = initVal.map((row) => [...row]);
            } else {
              this.dpDimensions = 1;
              this.dpTableValues = [initVal.map((v) => v)];
            }
          }

          this.recordStep(
            stmt.line,
            'init',
            `Declared ${varType} ${item.name}`
          );
        }
        break;
      }

      case 'AssignmentStatement': {
        const assign = stmt as AssignmentStatementNode;
        const val = this.evaluateExpression(assign.value, scope);
        scope.set(assign.target, val);

        const isDpName = ['dp', 'memo', 'table', 'opt'].includes(assign.target.toLowerCase());
        if (isDpName && Array.isArray(val)) {
          this.dpTableName = assign.target;
          if (val.length > 0 && Array.isArray(val[0])) {
            this.dpDimensions = 2;
            this.dpTableValues = val.map((row) => [...row]);
          } else {
            this.dpDimensions = 1;
            this.dpTableValues = [val.map((v) => v)];
          }
        }

        this.recordStep(
          stmt.line,
          'compute',
          `Set ${assign.target} = ${typeof val === 'object' ? JSON.stringify(val) : val}`
        );
        break;
      }

      case 'CompoundAssignmentStatement': {
        const compound = stmt as CompoundAssignmentStatementNode;
        const rightVal = this.evaluateExpression(compound.value, scope);
        if (compound.target.type === 'Identifier') {
          const varName = (compound.target as IdentifierNode).name;
          const currentVal = scope.get(varName);
          const newVal = this.applyBinaryOp(compound.operator.replace('=', ''), currentVal, rightVal);
          scope.set(varName, newVal);

          this.recordStep(
            stmt.line,
            'compute',
            `${varName} ${compound.operator} ${rightVal} -> ${newVal}`
          );
        }
        break;
      }

      case 'IndexAssignmentStatement': {
        const idxStmt = stmt as IndexAssignmentStatementNode;
        const arrayTarget = this.evaluateExpression(idxStmt.array, scope);
        const arrayName = idxStmt.array.type === 'Identifier' ? (idxStmt.array as IdentifierNode).name : 'arr';

        this.currentReadDependencies = [];
        const rightVal = this.evaluateExpression(idxStmt.value, scope);

        if (arrayTarget instanceof CppMap) {
          const key = this.evaluateExpression(idxStmt.indices[0], scope);
          arrayTarget.set(key, rightVal);
          this.recordStep(
            stmt.line,
            'compute',
            `Set map ${arrayName}[${JSON.stringify(key)}] = ${rightVal}`
          );
          return;
        }

        const evaluatedIndices = idxStmt.indices.map((idxExpr) =>
          Number(this.evaluateExpression(idxExpr, scope))
        );

        if (evaluatedIndices.length === 1) {
          const idx = evaluatedIndices[0];
          const prevVal = arrayTarget[idx];
          const finalVal = idxStmt.operator && idxStmt.operator !== '='
            ? this.applyBinaryOp(idxStmt.operator.replace('=', ''), prevVal, rightVal)
            : rightVal;

          arrayTarget[idx] = finalVal;

          if (this.isMatchingDpTable(arrayName)) {
            if (this.dpDimensions === 1) {
              if (!this.dpTableValues[0]) this.dpTableValues[0] = [];
              this.dpTableValues[0][idx] = finalVal;
            } else {
              if (!this.dpTableValues[idx]) this.dpTableValues[idx] = [];
              this.dpTableValues[idx][0] = finalVal;
            }
          }

          const formulaObj = this.generateLiveFormula(
            arrayName,
            [idx],
            finalVal,
            this.currentReadDependencies
          );

          this.recordStep(
            stmt.line,
            'compute',
            `Updated ${arrayName}[${idx}] = ${finalVal}`,
            { row: this.dpDimensions === 1 ? 0 : idx, col: this.dpDimensions === 1 ? idx : 0, prevVal, newVal: finalVal },
            formulaObj
          );
        } else if (evaluatedIndices.length === 2) {
          const [row, col] = evaluatedIndices;
          if (!arrayTarget[row]) arrayTarget[row] = [];
          const prevVal = arrayTarget[row][col];
          const finalVal = idxStmt.operator && idxStmt.operator !== '='
            ? this.applyBinaryOp(idxStmt.operator.replace('=', ''), prevVal, rightVal)
            : rightVal;

          arrayTarget[row][col] = finalVal;

          if (this.isMatchingDpTable(arrayName)) {
            if (!this.dpTableValues[row]) this.dpTableValues[row] = [];
            this.dpTableValues[row][col] = finalVal;
          }

          const formulaObj = this.generateLiveFormula(
            arrayName,
            [row, col],
            finalVal,
            this.currentReadDependencies
          );

          this.recordStep(
            stmt.line,
            'compute',
            `Calculated ${arrayName}[${row}][${col}] = ${finalVal}`,
            { row, col, prevVal, newVal: finalVal },
            formulaObj
          );
        }
        break;
      }

      case 'MemberAssignmentStatement': {
        const memStmt = stmt as MemberAssignmentStatementNode;
        const obj = this.evaluateExpression(memStmt.object, scope);
        const rightVal = this.evaluateExpression(memStmt.value, scope);
        const objName = this.extractIdentifierName(memStmt.object) || 'obj';
        if (Array.isArray(obj) && (memStmt.property === 'first' || memStmt.property === 'second')) {
          const idx = memStmt.property === 'first' ? 0 : 1;
          obj[idx] = rightVal;
        } else if (obj && typeof obj === 'object') {
          obj[memStmt.property] = rightVal;
        }
        this.recordStep(
          stmt.line,
          'compute',
          `Set ${objName}.${memStmt.property} = ${rightVal}`
        );
        break;
      }

      case 'TieAssignmentStatement': {
        const tieStmt = stmt as TieAssignmentStatementNode;
        const val = this.evaluateExpression(tieStmt.value, scope);
        if (Array.isArray(val)) {
          tieStmt.variables.forEach((varName: string, idx: number) => {
            if (varName && varName !== 'ignore') {
              scope.set(varName, val[idx]);
            }
          });
          this.recordStep(
            stmt.line,
            'compute',
            `tie(${tieStmt.variables.join(', ')}) = [${val.join(', ')}]`
          );
        }
        break;
      }

      case 'IfStatement': {
        const ifStmt = stmt as IfStatementNode;
        const cond = this.evaluateExpression(ifStmt.condition, scope);
        if (Boolean(cond)) {
          this.executeStatement(ifStmt.consequent, scope);
        } else if (ifStmt.alternate) {
          this.executeStatement(ifStmt.alternate, scope);
        }
        break;
      }

      case 'WhileStatement': {
        const whileStmt = stmt as WhileStatementNode;
        let iters = 0;
        while (Boolean(this.evaluateExpression(whileStmt.condition, scope))) {
          if (++iters > 10000) throw new Error('Infinite while loop detected');
          try {
            this.executeStatement(whileStmt.body, scope);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        break;
      }

      case 'ForStatement': {
        const forStmt = stmt as ForStatementNode;
        const forScope = new Scope(scope);
        if (forStmt.init) {
          this.executeStatement(forStmt.init, forScope);
        }
        let iters = 0;
        while (true) {
          this.activeScope = forScope;
          if (forStmt.condition) {
            const cond = this.evaluateExpression(forStmt.condition, forScope);
            if (!Boolean(cond)) break;
          }
          if (++iters > 15000) throw new Error('For loop iteration limit exceeded');

          try {
            this.executeStatement(forStmt.body, forScope);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) {
              // continue to update
            } else {
              throw e;
            }
          }

          if (forStmt.update) {
            this.activeScope = forScope;
            this.evaluateExpression(forStmt.update, forScope);
          }
        }
        break;
      }

      case 'RangeForStatement': {
        const rangeStmt = stmt as RangeForStatementNode;
        const rawIterable = this.evaluateExpression(rangeStmt.iterable, scope);
        let items: any[] = [];
        if (Array.isArray(rawIterable)) {
          items = rawIterable;
        } else if (rawIterable instanceof CppMap) {
          items = Array.from(rawIterable.data.entries());
        } else if (rawIterable instanceof CppSet) {
          items = rawIterable.toArray();
        } else if (rawIterable instanceof CppDeque || rawIterable instanceof CppPriorityQueue) {
          items = [...rawIterable.items];
        } else if (typeof rawIterable === 'string') {
          items = Array.from(rawIterable);
        } else {
          throw new Error(`Range-for requires an iterable at line ${stmt.line}`);
        }

        for (let idx = 0; idx < items.length; idx++) {
          const item = items[idx];
          const loopScope = new Scope(scope);
          if (rangeStmt.bindings && Array.isArray(item)) {
            rangeStmt.bindings.forEach((bName, bIdx) => {
              loopScope.declare(bName, item[bIdx]);
            });
          } else if (rangeStmt.varName) {
            loopScope.declare(rangeStmt.varName, item);
          }
          this.activeScope = loopScope;
          this.recordStep(
            rangeStmt.line,
            'compute',
            `Range-for: ${rangeStmt.varName || (rangeStmt.bindings ? `[${rangeStmt.bindings.join(', ')}]` : 'item')} = ${JSON.stringify(item)}`
          );
          try {
            this.executeStatement(rangeStmt.body, loopScope);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        break;
      }

      case 'ReturnStatement': {
        const retStmt = stmt as ReturnStatementNode;
        let retVal: any = null;
        if (retStmt.argument) {
          retVal = this.evaluateExpression(retStmt.argument, scope);
        }
        throw new ReturnValue(retVal);
      }

      case 'BreakStatement':
        throw new BreakSignal();

      case 'ContinueStatement':
        throw new ContinueSignal();

      case 'ExpressionStatement': {
        const exprStmt = stmt as ExpressionStatementNode;
        const initialStdoutLen = this.stdout.length;
        this.evaluateExpression(exprStmt.expression, scope);
        if (this.stdout.length > initialStdoutLen) {
          const printed = this.stdout.slice(initialStdoutLen).trim();
          this.recordStep(exprStmt.line, 'compute', `cout << ${printed}`);
        }
        break;
      }
    }
  }

  public evaluateExpression(expr: BaseASTNode, scope: Scope): any {
    switch (expr.type) {
      case 'Literal':
        return (expr as LiteralNode).value;

      case 'Identifier': {
        const name = (expr as IdentifierNode).name;
        return scope.get(name);
      }

      case 'ArrayLiteral': {
        const arr = expr as ArrayLiteralNode;
        return arr.elements.map((el) => this.evaluateExpression(el, scope));
      }

      case 'UnaryExpression': {
        const unary = expr as UnaryExpressionNode;
        const val = this.evaluateExpression(unary.argument, scope);
        if (unary.operator === '!') return !val;
        if (unary.operator === '-') return -val;
        if (unary.operator === '+') return +val;
        if (unary.operator === '~') return ~val;
        if (unary.operator === '*') {
          if (val && typeof val === 'object' && val.__isIterator) {
            return val.container[val.index];
          }
          return val;
        }
        throw new Error(`Unsupported unary operator: ${unary.operator}`);
      }

      case 'TypeCastExpression': {
        const cast = expr as any;
        const val = this.evaluateExpression(cast.argument, scope);
        const t = (cast.targetType || '').toLowerCase();
        if (t.includes('int') || t.includes('long') || t.includes('short') || t === 'll' || t === 'ull') {
          return Math.trunc(Number(val));
        }
        if (t.includes('double') || t.includes('float')) {
          return Number(val);
        }
        if (t.includes('bool')) {
          return Boolean(val);
        }
        if (t.includes('char')) {
          return typeof val === 'number' ? String.fromCharCode(val) : String(val);
        }
        return val;
      }

      case 'SequenceExpression': {
        const seq = expr as any;
        let lastVal: any = null;
        for (const e of seq.expressions) {
          lastVal = this.evaluateExpression(e, scope);
        }
        return lastVal;
      }

      case 'UpdateExpression': {
        const update = expr as UpdateExpressionNode;
        if (update.argument.type === 'Identifier') {
          const varName = (update.argument as IdentifierNode).name;
          const oldVal = Number(scope.get(varName));
          const newVal = update.operator === '++' ? oldVal + 1 : oldVal - 1;
          scope.set(varName, newVal);
          return update.prefix ? newVal : oldVal;
        }
        throw new Error('Update expression target must be a variable');
      }

      case 'BinaryExpression': {
        const bin = expr as BinaryExpressionNode;
        if (bin.operator === '&&') {
          const leftVal = this.evaluateExpression(bin.left, scope);
          if (!Boolean(leftVal)) return false;
          return Boolean(this.evaluateExpression(bin.right, scope));
        }
        if (bin.operator === '||') {
          const leftVal = this.evaluateExpression(bin.left, scope);
          if (Boolean(leftVal)) return true;
          return Boolean(this.evaluateExpression(bin.right, scope));
        }

        if (bin.operator === '>>') {
          const leftVal = this.evaluateExpression(bin.left, scope);
          if (leftVal === 'cin') {
            const nextVal = this.readNextStdin();
            if (bin.right.type === 'Identifier') {
              const name = (bin.right as IdentifierNode).name;
              scope.set(name, nextVal);
              this.recordStep(bin.line, 'compute', `cin >> ${name} (read ${nextVal})`);
            } else if (bin.right.type === 'IndexAccessExpression') {
              const idxExpr = bin.right as IndexAccessExpressionNode;
              const target = this.evaluateExpression(idxExpr.array, scope);
              const idx = this.evaluateExpression(idxExpr.index, scope);
              if (target) {
                target[idx] = nextVal;
                const arrName = this.extractIdentifierName(idxExpr.array) || 'arr';
                this.recordStep(bin.line, 'compute', `cin >> ${arrName}[${idx}] (read ${nextVal})`);
              }
            } else if (bin.right.type === 'MemberAccessExpression') {
              const memExpr = bin.right as MemberAccessExpressionNode;
              const target = this.evaluateExpression(memExpr.object, scope);
              if (Array.isArray(target) && (memExpr.property === 'first' || memExpr.property === 'second')) {
                const idx = memExpr.property === 'first' ? 0 : 1;
                target[idx] = nextVal;
              } else if (target) {
                target[memExpr.property] = nextVal;
              }
              const objName = this.extractIdentifierName(memExpr.object) || 'obj';
              this.recordStep(bin.line, 'compute', `cin >> ${objName}.${memExpr.property} (read ${nextVal})`);
            }
            return 'cin';
          }
          const rightVal = this.evaluateExpression(bin.right, scope);
          return this.applyBinaryOp(bin.operator, leftVal, rightVal);
        }

        const leftVal = this.evaluateExpression(bin.left, scope);
        const rightVal = this.evaluateExpression(bin.right, scope);
        return this.applyBinaryOp(bin.operator, leftVal, rightVal);
      }

      case 'ConditionalExpression': {
        const cond = expr as ConditionalExpressionNode;
        const test = this.evaluateExpression(cond.condition, scope);
        return Boolean(test)
          ? this.evaluateExpression(cond.consequent, scope)
          : this.evaluateExpression(cond.alternate, scope);
      }

      case 'IndexAccessExpression': {
        const idxExpr = expr as IndexAccessExpressionNode;
        const target = this.evaluateExpression(idxExpr.array, scope);
        const indexVal = this.evaluateExpression(idxExpr.index, scope);

        if (target instanceof CppMap) {
          return target.get(indexVal);
        }
        if (target instanceof CppDeque) {
          return target.items[indexVal];
        }

        const targetName = this.extractIdentifierName(idxExpr.array);
        if (targetName && this.isMatchingDpTable(targetName)) {
          if (idxExpr.array.type === 'IndexAccessExpression') {
            const outer = idxExpr.array as IndexAccessExpressionNode;
            const outerRow = Number(this.evaluateExpression(outer.index, scope));
            const innerCol = Number(indexVal);
            this.currentReadDependencies.push({ row: outerRow, col: innerCol });
          } else {
            const idxNum = Number(indexVal);
            this.currentReadDependencies.push({
              row: this.dpDimensions === 1 ? 0 : idxNum,
              col: this.dpDimensions === 1 ? idxNum : 0,
            });
          }
        }

        return target ? target[indexVal] : undefined;
      }

      case 'CallExpression': {
        const call = expr as CallExpressionNode;
        const fnName = call.callee;
        const argValues = call.args.map((a) => this.evaluateExpression(a, scope));

        // Functional type casts: int(x), double(x), ll(x)
        if (['int', 'long', 'll', 'short', 'signed', 'unsigned', 'int32_t', 'int64_t', 'uint32_t', 'uint64_t', 'size_t'].includes(fnName)) {
          return Math.trunc(Number(argValues[0] ?? 0));
        }
        if (fnName === 'double' || fnName === 'float') {
          return Number(argValues[0] ?? 0);
        }
        if (fnName === 'bool') {
          return Boolean(argValues[0]);
        }
        if (fnName === 'char') {
          return typeof argValues[0] === 'number' ? String.fromCharCode(argValues[0]) : String(argValues[0]);
        }

        if (fnName === 'max' || fnName === 'min') {
          const flat: number[] = [];
          for (const a of argValues) {
            if (Array.isArray(a)) flat.push(...a.map(Number));
            else flat.push(Number(a));
          }
          return fnName === 'min' ? Math.min(...flat) : Math.max(...flat);
        }
        if (fnName === 'abs') return Math.abs(argValues[0]);
        if (fnName === 'sqrt') return Math.sqrt(argValues[0]);
        if (fnName === 'pow') return Math.pow(argValues[0], argValues[1]);
        if (fnName === 'ceil') return Math.ceil(argValues[0]);
        if (fnName === 'floor') return Math.floor(argValues[0]);
        if (fnName === 'round') return Math.round(argValues[0]);
        if (fnName === '__gcd' || fnName === 'gcd') return gcd(Number(argValues[0]), Number(argValues[1]));
        if (fnName === 'lcm') return lcm(Number(argValues[0]), Number(argValues[1]));
        if (fnName === '__builtin_popcount' || fnName === '__builtin_popcountll') return popcount(Number(argValues[0]));
        if (fnName === '__builtin_clz' || fnName === '__builtin_clzll') {
          return Math.clz32(Number(argValues[0]));
        }
        if (fnName === '__builtin_ctz' || fnName === '__builtin_ctzll') {
          let n = BigInt(Math.floor(Number(argValues[0])));
          if (n === 0n) return 32;
          let c = 0;
          while ((n & 1n) === 0n) {
            c++;
            n >>= 1n;
          }
          return c;
        }

        if (fnName === 'memset') {
          const target = this.evaluateExpression(call.args[0], scope);
          const fillVal = Number(argValues[1]);
          const targetName = this.extractIdentifierName(call.args[0]) || 'arr';
          const fillRec = (arr: any[]) => {
            for (let i = 0; i < arr.length; i++) {
              if (Array.isArray(arr[i])) fillRec(arr[i]);
              else arr[i] = fillVal;
            }
          };
          if (Array.isArray(target)) {
            fillRec(target);
            if (this.isMatchingDpTable(targetName)) {
              fillRec(this.dpTableValues);
            }
            this.recordStep(call.line, 'compute', `memset(${targetName}, ${fillVal})`);
          }
          return null;
        }

        if (fnName === 'lower_bound' || fnName === 'upper_bound') {
          let targetArr: any[] | null = null;
          let val: any;
          if (argValues.length >= 3) {
            targetArr = argValues[0]?.__isIterator ? argValues[0].container : (Array.isArray(argValues[0]) ? argValues[0] : null);
            val = argValues[2];
          } else {
            targetArr = argValues[0]?.__isIterator ? argValues[0].container : (Array.isArray(argValues[0]) ? argValues[0] : null);
            val = argValues[1];
          }
          if (targetArr) {
            let idx = targetArr.length;
            for (let i = 0; i < targetArr.length; i++) {
              if (fnName === 'lower_bound' ? targetArr[i] >= val : targetArr[i] > val) {
                idx = i;
                break;
              }
            }
            return { __isIterator: true, container: targetArr, index: idx };
          }
          return 0;
        }

        if (fnName === 'binary_search') {
          const targetArr = argValues[0]?.__isIterator ? argValues[0].container : (Array.isArray(argValues[0]) ? argValues[0] : null);
          const val = argValues.length >= 3 ? argValues[2] : argValues[1];
          return targetArr ? targetArr.includes(val) : false;
        }

        if (fnName === 'accumulate') {
          const targetArr = argValues[0]?.__isIterator ? argValues[0].container : (Array.isArray(argValues[0]) ? argValues[0] : null);
          const init = Number(argValues[argValues.length - 1] ?? 0);
          if (targetArr) {
            return targetArr.reduce((acc: any, x: any) => acc + Number(x), init);
          }
          return init;
        }

        if (fnName === 'min_element') {
          const targetArr = argValues[0]?.__isIterator ? argValues[0].container : (Array.isArray(argValues[0]) ? argValues[0] : null);
          if (targetArr && targetArr.length > 0) {
            let minIdx = 0;
            for (let i = 1; i < targetArr.length; i++) {
              if (targetArr[i] < targetArr[minIdx]) minIdx = i;
            }
            return { __isIterator: true, container: targetArr, index: minIdx };
          }
          return { __isIterator: true, container: [], index: 0 };
        }

        if (fnName === 'max_element') {
          const targetArr = argValues[0]?.__isIterator ? argValues[0].container : (Array.isArray(argValues[0]) ? argValues[0] : null);
          if (targetArr && targetArr.length > 0) {
            let maxIdx = 0;
            for (let i = 1; i < targetArr.length; i++) {
              if (targetArr[i] > targetArr[maxIdx]) maxIdx = i;
            }
            return { __isIterator: true, container: targetArr, index: maxIdx };
          }
          return { __isIterator: true, container: [], index: 0 };
        }

        if (fnName === 'count') {
          const targetArr = argValues[0]?.__isIterator ? argValues[0].container : (Array.isArray(argValues[0]) ? argValues[0] : null);
          const val = argValues.length >= 3 ? argValues[2] : argValues[1];
          if (targetArr) {
            return targetArr.filter((x: any) => x === val).length;
          }
          return 0;
        }

        if (fnName === 'fill') {
          const targetArr = argValues[0]?.__isIterator ? argValues[0].container : (Array.isArray(argValues[0]) ? argValues[0] : null);
          const val = argValues.length >= 3 ? argValues[2] : argValues[1];
          if (targetArr) {
            targetArr.fill(val);
            this.recordStep(call.line, 'compute', `fill() array with ${val}`);
          }
          return null;
        }

        if (fnName === 'next_permutation') {
          const targetArr = argValues[0]?.__isIterator ? argValues[0].container : (Array.isArray(argValues[0]) ? argValues[0] : null);
          if (targetArr && targetArr.length > 1) {
            let i = targetArr.length - 2;
            while (i >= 0 && targetArr[i] >= targetArr[i + 1]) i--;
            if (i < 0) {
              targetArr.reverse();
              this.recordStep(call.line, 'compute', `next_permutation() reset`);
              return false;
            }
            let j = targetArr.length - 1;
            while (targetArr[j] <= targetArr[i]) j--;
            const tmp = targetArr[i]; targetArr[i] = targetArr[j]; targetArr[j] = tmp;
            let l = i + 1, r = targetArr.length - 1;
            while (l < r) {
              const t = targetArr[l]; targetArr[l] = targetArr[r]; targetArr[r] = t;
              l++; r--;
            }
            this.recordStep(call.line, 'compute', `next_permutation() -> [${targetArr.join(', ')}]`);
            return true;
          }
          return false;
        }

        if (fnName.startsWith('priority_queue')) {
          return new CppPriorityQueue(fnName.includes('greater'));
        }
        if (fnName.startsWith('deque')) {
          return new CppDeque();
        }
        if (fnName.startsWith('set') || fnName.startsWith('unordered_set') || fnName.startsWith('multiset')) {
          return new CppSet(fnName.startsWith('multiset'));
        }

        if (fnName === 'swap') {
          const arg0 = call.args[0];
          const arg1 = call.args[1];
          const val0 = this.evaluateExpression(arg0, scope);
          const val1 = this.evaluateExpression(arg1, scope);
          this.assignToTarget(arg0, val1, scope);
          this.assignToTarget(arg1, val0, scope);
          this.recordStep(call.line, 'compute', `Swapped ${JSON.stringify(val0)} and ${JSON.stringify(val1)}`);
          return null;
        }

        if (fnName === 'sort') {
          const isIter0 = argValues[0]?.__isIterator;
          const target = isIter0 ? argValues[0].container : argValues[0];
          if (Array.isArray(target)) {
            const start = isIter0 ? argValues[0].index : 0;
            const end = argValues[1]?.__isIterator ? argValues[1].index : target.length;
            const isReverse = argValues[0]?.isReverse || argValues[1]?.isReverse;
            const cmp = isIter0 ? argValues[2] : argValues[1];

            const slice = target.slice(start, end);
            if (isReverse || cmp === 'greater' || (typeof cmp === 'string' && cmp.includes('greater'))) {
              slice.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
            } else if (typeof cmp === 'function') {
              slice.sort(cmp);
            } else {
              slice.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
            }
            target.splice(start, slice.length, ...slice);
            this.recordStep(call.line, 'compute', `Sorted array`);
          }
          return null;
        }

        if (fnName === 'reverse') {
          const isIter0 = argValues[0]?.__isIterator;
          const target = isIter0 ? argValues[0].container : argValues[0];
          if (Array.isArray(target)) {
            const start = isIter0 ? argValues[0].index : 0;
            const end = argValues[1]?.__isIterator ? argValues[1].index : target.length;
            const slice = target.slice(start, end);
            slice.reverse();
            target.splice(start, slice.length, ...slice);
            this.recordStep(call.line, 'compute', `Reversed array`);
          }
          return null;
        }

        if (fnName === 'tie') {
          return argValues;
        }

        if (fnName === 'sync_with_stdio') {
          return 0;
        }

        if (fnName.startsWith('vector')) {
          const size = Number(argValues[0] ?? 0);
          const defaultVal = argValues.length > 1 ? argValues[1] : 0;
          if (Array.isArray(defaultVal)) {
            return Array.from({ length: size }, () => [...defaultVal]);
          }
          return Array.from({ length: size }, () => defaultVal);
        }
        if (fnName.startsWith('stack')) {
          return new CppStack();
        }
        if (fnName.startsWith('queue')) {
          return new CppQueue();
        }
        if (fnName.startsWith('map') || fnName.startsWith('unordered_map')) {
          return new CppMap();
        }
        if (fnName === 'make_pair' || fnName.startsWith('pair')) {
          return [argValues[0], argValues[1]];
        }

        const fn = this.functions.get(fnName);
        if (!fn) {
          throw new Error(`Call to undefined function '${fnName}' at line ${call.line}`);
        }
        return this.invokeFunction(fn, argValues, call);
      }

      case 'MemberCallExpression': {
        const mCall = expr as MemberCallExpressionNode;
        const obj = this.evaluateExpression(mCall.object, scope);
        const method = mCall.method;
        const targetName = this.extractIdentifierName(mCall.object) || 'container';

        if (method === 'size' || method === 'length') {
          return obj ? (typeof obj.size === 'function' ? obj.size() : obj.length) : 0;
        }
        if (method === 'empty') {
          return obj ? (typeof obj.empty === 'function' ? obj.empty() : obj.length === 0) : true;
        }
        if (method === 'push_back') {
          const val = this.evaluateExpression(mCall.args[0], scope);
          if (obj instanceof CppDeque) {
            obj.push_back(val);
          } else if (Array.isArray(obj)) {
            obj.push(val);
          }
          this.recordStep(mCall.line, 'compute', `Pushed ${val} to ${targetName}`);
          return null;
        }
        if (method === 'pop_back') {
          let val: any;
          if (obj instanceof CppDeque) {
            val = obj.pop_back();
          } else if (Array.isArray(obj)) {
            val = obj.pop();
          }
          this.recordStep(mCall.line, 'compute', `Popped ${val} from ${targetName}`);
          return val;
        }
        if (method === 'push_front' || method === 'emplace_front') {
          const val = this.evaluateExpression(mCall.args[0], scope);
          if (obj instanceof CppDeque) {
            obj.push_front(val);
            this.recordStep(mCall.line, 'compute', `Pushed front ${val} to ${targetName}`);
          }
          return null;
        }
        if (method === 'pop_front') {
          if (obj instanceof CppDeque) {
            const val = obj.pop_front();
            this.recordStep(mCall.line, 'compute', `Popped front ${val} from ${targetName}`);
            return val;
          }
          return null;
        }
        if (method === 'emplace_back') {
          let val: any;
          if (mCall.args.length === 1) {
            val = this.evaluateExpression(mCall.args[0], scope);
          } else if (mCall.args.length === 2) {
            val = [
              this.evaluateExpression(mCall.args[0], scope),
              this.evaluateExpression(mCall.args[1], scope),
            ];
          } else {
            val = mCall.args.map((a) => this.evaluateExpression(a, scope));
          }
          if (obj instanceof CppDeque) {
            obj.emplace_back(val);
          } else if (Array.isArray(obj)) {
            obj.push(val);
          }
          this.recordStep(mCall.line, 'compute', `Emplaced back ${JSON.stringify(val)} into ${targetName}`);
          return null;
        }
        if (method === 'assign') {
          const count = Number(this.evaluateExpression(mCall.args[0], scope));
          const fillVal = mCall.args.length > 1 ? this.evaluateExpression(mCall.args[1], scope) : 0;
          if (Array.isArray(obj)) {
            obj.length = 0;
            for (let i = 0; i < count; i++) {
              obj.push(typeof fillVal === 'object' && fillVal !== null ? JSON.parse(JSON.stringify(fillVal)) : fillVal);
            }
            this.recordStep(mCall.line, 'compute', `Assigned ${count} elements to ${targetName}`);
            return null;
          }
        }
        if (method === 'resize') {
          const newSize = Number(this.evaluateExpression(mCall.args[0], scope));
          const fillVal = mCall.args.length > 1 ? this.evaluateExpression(mCall.args[1], scope) : 0;
          if (Array.isArray(obj)) {
            if (newSize < obj.length) {
              obj.length = newSize;
            } else {
              while (obj.length < newSize) {
                obj.push(typeof fillVal === 'object' && fillVal !== null ? JSON.parse(JSON.stringify(fillVal)) : fillVal);
              }
            }
            this.recordStep(mCall.line, 'compute', `Resized ${targetName} to ${newSize}`);
            return null;
          }
        }
        if (method === 'emplace') {
          let val: any;
          if (mCall.args.length === 1) {
            val = this.evaluateExpression(mCall.args[0], scope);
          } else if (mCall.args.length === 2) {
            val = [
              this.evaluateExpression(mCall.args[0], scope),
              this.evaluateExpression(mCall.args[1], scope),
            ];
          } else {
            val = mCall.args.map((a) => this.evaluateExpression(a, scope));
          }
          if (obj instanceof CppStack || obj instanceof CppQueue || obj instanceof CppPriorityQueue) {
            obj.push(val);
            this.recordStep(mCall.line, 'compute', `Emplaced ${JSON.stringify(val)} into ${targetName}`);
            return null;
          }
          if (Array.isArray(obj)) {
            obj.push(val);
            this.recordStep(mCall.line, 'compute', `Emplaced ${JSON.stringify(val)} into ${targetName}`);
            return null;
          }
        }
        if (method === 'push') {
          const val = this.evaluateExpression(mCall.args[0], scope);
          if (obj instanceof CppStack || obj instanceof CppQueue || obj instanceof CppPriorityQueue) {
            obj.push(val);
            this.recordStep(mCall.line, 'compute', `Pushed ${val} into ${targetName}`);
            return null;
          }
          if (Array.isArray(obj)) {
            obj.push(val);
            this.recordStep(mCall.line, 'compute', `Pushed ${val} into ${targetName}`);
            return null;
          }
        }
        if (method === 'pop') {
          if (obj instanceof CppStack || obj instanceof CppQueue || obj instanceof CppPriorityQueue) {
            const val = obj.pop();
            this.recordStep(mCall.line, 'compute', `Popped ${val} from ${targetName}`);
            return val;
          }
          if (Array.isArray(obj)) {
            const val = obj.pop();
            this.recordStep(mCall.line, 'compute', `Popped ${val} from ${targetName}`);
            return val;
          }
        }
        if (method === 'top') {
          if (obj instanceof CppStack || obj instanceof CppPriorityQueue) return obj.top();
          if (Array.isArray(obj)) return obj[obj.length - 1];
        }
        if (method === 'front') {
          if (obj instanceof CppQueue || obj instanceof CppDeque) return obj.front();
          if (Array.isArray(obj)) return obj[0];
        }
        if (method === 'back') {
          if (obj instanceof CppQueue || obj instanceof CppDeque) return obj.back();
          if (Array.isArray(obj)) return obj[obj.length - 1];
        }
        if (method === 'insert') {
          const val = this.evaluateExpression(mCall.args[0], scope);
          if (obj instanceof CppSet) {
            obj.insert(val);
            this.recordStep(mCall.line, 'compute', `Inserted ${val} into ${targetName}`);
            return null;
          }
          if (Array.isArray(obj)) {
            const idx = typeof val === 'number' ? val : 0;
            const insertVal = mCall.args.length > 1 ? this.evaluateExpression(mCall.args[1], scope) : val;
            obj.splice(idx, 0, insertVal);
            return null;
          }
        }
        if (method === 'count') {
          const key = this.evaluateExpression(mCall.args[0], scope);
          if (obj instanceof CppMap || obj instanceof CppSet) {
            return obj.count(key);
          }
          return 0;
        }
        if (method === 'find') {
          const key = this.evaluateExpression(mCall.args[0], scope);
          if (obj instanceof CppMap) {
            return obj.data.has(key) ? true : null;
          }
          if (obj instanceof CppSet) {
            return obj.count(key) > 0 ? true : null;
          }
          return null;
        }
        if (method === 'erase') {
          const key = this.evaluateExpression(mCall.args[0], scope);
          if (obj instanceof CppMap) {
            obj.data.delete(key);
            this.recordStep(mCall.line, 'compute', `Erased key ${key} from ${targetName}`);
            return null;
          }
          if (obj instanceof CppSet) {
            obj.erase(key);
            this.recordStep(mCall.line, 'compute', `Erased ${key} from ${targetName}`);
            return null;
          }
          if (Array.isArray(obj)) {
            const idx = key;
            if (typeof idx === 'number') {
              obj.splice(idx, 1);
              this.recordStep(mCall.line, 'compute', `Erased index ${idx} from ${targetName}`);
            }
            return null;
          }
        }
        if (method === 'clear') {
          if (obj instanceof CppMap) obj.data.clear();
          else if (obj instanceof CppStack || obj instanceof CppQueue || obj instanceof CppPriorityQueue || obj instanceof CppDeque) obj.clear();
          else if (obj instanceof CppSet) obj.clear();
          else if (Array.isArray(obj)) obj.length = 0;
          this.recordStep(mCall.line, 'compute', `Cleared ${targetName}`);
          return null;
        }
        if (method === 'begin') {
          if (Array.isArray(obj)) {
            return { __isIterator: true, container: obj, index: 0 };
          }
          return obj;
        }
        if (method === 'end') {
          if (Array.isArray(obj)) {
            return { __isIterator: true, container: obj, index: obj.length };
          }
          return obj;
        }
        if (method === 'rbegin') {
          if (Array.isArray(obj)) {
            return { __isIterator: true, container: obj, index: 0, isReverse: true };
          }
          return obj;
        }
        if (method === 'rend') {
          if (Array.isArray(obj)) {
            return { __isIterator: true, container: obj, index: obj.length, isReverse: true };
          }
          return obj;
        }
        if (method === 'tie' || method === 'sync_with_stdio') {
          return 0;
        }
        throw new Error(`Unsupported method .${method}() at line ${expr.line}`);
      }

      case 'MemberAccessExpression': {
        const mAccess = expr as MemberAccessExpressionNode;
        const obj = this.evaluateExpression(mAccess.object, scope);
        if (Array.isArray(obj) && (mAccess.property === 'first' || mAccess.property === 'second')) {
          return mAccess.property === 'first' ? obj[0] : obj[1];
        }
        return obj ? obj[mAccess.property] : undefined;
      }
    }

    return null;
  }

  private assignToTarget(targetNode: BaseASTNode, val: any, scope: Scope): void {
    if (targetNode.type === 'Identifier') {
      scope.set((targetNode as IdentifierNode).name, val);
    } else if (targetNode.type === 'IndexAccessExpression') {
      const idxExpr = targetNode as IndexAccessExpressionNode;
      const arr = this.evaluateExpression(idxExpr.array, scope);
      const idx = this.evaluateExpression(idxExpr.index, scope);
      if (arr instanceof CppDeque) {
        arr.items[idx] = val;
      } else if (arr) {
        arr[idx] = val;
      }
    } else if (targetNode.type === 'MemberAccessExpression') {
      const memExpr = targetNode as MemberAccessExpressionNode;
      const obj = this.evaluateExpression(memExpr.object, scope);
      if (Array.isArray(obj) && (memExpr.property === 'first' || memExpr.property === 'second')) {
        obj[memExpr.property === 'first' ? 0 : 1] = val;
      } else if (obj) {
        obj[memExpr.property] = val;
      }
    }
  }

  private invokeFunction(
    fn: FunctionDeclNode,
    argValues: any[],
    callNode: CallExpressionNode | null
  ): any {
    const fnScope = new Scope(this.globalScope);
    this.activeScope = fnScope;
    const argsObj: Record<string, any> = {};

    for (let i = 0; i < fn.params.length; i++) {
      const p = fn.params[i];
      const val = argValues[i];
      fnScope.declare(p.name, val);
      argsObj[p.name] = val;
    }

    const frame: CallStackFrame = {
      name: fn.name,
      args: argsObj,
      locals: {},
      line: callNode ? callNode.line : fn.line,
    };
    this.callStack.push(frame);

    const nodeId = `node_${this.recursionIdCounter++}`;
    const parentId = this.currentRecursionNodeId;
    const parentNode = parentId ? this.recursionNodes[parentId] : undefined;
    const depth = parentNode ? parentNode.depth + 1 : 0;

    const recursionNode: RecursionNode = {
      id: nodeId,
      name: fn.name,
      args: argsObj,
      status: 'active',
      parentId,
      childIds: [],
      depth,
    };

    if (parentNode) {
      parentNode.childIds.push(nodeId);
    }
    this.recursionNodes[nodeId] = recursionNode;

    const prevRecursionNodeId = this.currentRecursionNodeId;
    this.currentRecursionNodeId = nodeId;

    const memoKey = `${fn.name}(${Object.values(argsObj).slice(0, 2).join(',')})`;
    const isMemoLookupCandidate = this.isRecursiveMemoFunction(fn.name);

    if (isMemoLookupCandidate && this.memoLookupHistory.has(memoKey)) {
      const earlierNodeId = this.memoLookupHistory.get(memoKey)!;
      const cachedVal = this.recursionNodes[earlierNodeId]?.returnValue;

      if (cachedVal !== undefined) {
        recursionNode.status = 'memo_hit';
        recursionNode.cachedFromId = earlierNodeId;
        recursionNode.returnValue = cachedVal;

        this.recordStep(
          fn.line,
          'memo_hit',
          `Memo Cache Hit! Subproblem ${memoKey} already computed -> Instant return ${cachedVal}`
        );

        this.callStack.pop();
        this.currentRecursionNodeId = prevRecursionNodeId;
        return cachedVal;
      }
    }

    this.recordStep(
      fn.line,
      'compute',
      `Invoked ${fn.name}(${Object.entries(argsObj).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ')})`
    );

    let resultVal: any = undefined;
    try {
      this.executeStatement(fn.body, fnScope);
    } catch (e) {
      if (e instanceof ReturnValue) {
        resultVal = e.value;
      } else {
        throw e;
      }
    } finally {
      this.callStack.pop();
      recursionNode.returnValue = resultVal;
      if (recursionNode.status !== 'memo_hit') {
        recursionNode.status = 'done';
        if (isMemoLookupCandidate) {
          this.memoLookupHistory.set(memoKey, nodeId);
        }
      }
      this.currentRecursionNodeId = prevRecursionNodeId;
    }

    return resultVal;
  }

  private isRecursiveMemoFunction(fnName: string): boolean {
    return fnName !== 'main' && ['solve', 'memo', 'dp', 'helper', 'count', 'knapsack', 'lcs', 'robSubtree'].some((k) =>
      fnName.toLowerCase().includes(k.toLowerCase())
    );
  }

  private isMatchingDpTable(varName: string): boolean {
    const lower = varName.toLowerCase();
    return lower === this.dpTableName.toLowerCase() || ['dp', 'memo', 'table', 'opt'].includes(lower);
  }

  private extractIdentifierName(node: BaseASTNode): string | null {
    if (node.type === 'Identifier') return (node as IdentifierNode).name;
    if (node.type === 'IndexAccessExpression') {
      return this.extractIdentifierName((node as IndexAccessExpressionNode).array);
    }
    return null;
  }

  private generateLiveFormula(
    tableName: string,
    indices: number[],
    resultVal: any,
    dependencies: DPPosition[]
  ): LiveFormula {
    const idxStr = indices.map((i) => `[${i}]`).join('');
    const target = `${tableName}${idxStr}`;

    if (dependencies.length === 0) {
      return {
        template: `${target} = Base Case`,
        substituted: `${target} = ${resultVal}`,
        resultValue: resultVal,
      };
    }

    const depStrs = dependencies.map(
      (d) => `${tableName}[${d.row}][${d.col}] (${this.dpTableValues[d.row]?.[d.col] ?? '?'})`
    );

    return {
      template: this.formulaTemplate || `${target} = f(dependencies)`,
      substituted: `${target} = from { ${depStrs.join(', ')} } -> ${resultVal}`,
      resultValue: resultVal,
    };
  }

  private applyBinaryOp(op: string, a: any, b: any): any {
    switch (op) {
      case '+': {
        if (typeof a === 'bigint' || typeof b === 'bigint') {
          const res = BigInt(a) + BigInt(b);
          return res >= -9007199254740991n && res <= 9007199254740991n ? Number(res) : res;
        }
        return a + b;
      }
      case '-': {
        const leftIdx = a && typeof a === 'object' && a.__isIterator ? a.index : a;
        const rightIdx = b && typeof b === 'object' && b.__isIterator ? b.index : b;
        if (typeof leftIdx === 'bigint' || typeof rightIdx === 'bigint') {
          const res = BigInt(leftIdx) - BigInt(rightIdx);
          return res >= -9007199254740991n && res <= 9007199254740991n ? Number(res) : res;
        }
        return leftIdx - rightIdx;
      }
      case '*': {
        if (typeof a === 'number' && typeof b === 'number' && (Math.abs(a * b) > Number.MAX_SAFE_INTEGER || Math.abs(a) > 1e8 || Math.abs(b) > 1e8)) {
          try {
            const res = BigInt(Math.trunc(a)) * BigInt(Math.trunc(b));
            if (res >= -9007199254740991n && res <= 9007199254740991n) return Number(res);
            return res;
          } catch {
            return a * b;
          }
        }
        if (typeof a === 'bigint' || typeof b === 'bigint') {
          const res = BigInt(a) * BigInt(b);
          return res >= -9007199254740991n && res <= 9007199254740991n ? Number(res) : res;
        }
        return a * b;
      }
      case '/': {
        if (typeof a === 'bigint' || typeof b === 'bigint') {
          const res = BigInt(a) / BigInt(b);
          return Number(res);
        }
        return Math.floor(a / b);
      }
      case '%': {
        if (typeof a === 'bigint' || typeof b === 'bigint') {
          const res = BigInt(a) % BigInt(b);
          return Number(res);
        }
        return a % b;
      }
      case '==': return a == b;
      case '!=': return a != b;
      case '<': return a < b;
      case '<=': return a <= b;
      case '>': return a > b;
      case '>=': return a >= b;
      case '&': return a & b;
      case '|': return a | b;
      case '^': return a ^ b;
      case '<<': {
        if (a === 'cout' || typeof a === 'string') {
          let strVal = b;
          if (b && typeof b === 'object' && b.__isIterator) {
            strVal = b.container[b.index];
          } else if (b === 'endl') {
            strVal = '\n';
          } else if (typeof b === 'boolean') {
            strVal = b ? 1 : 0;
          }
          this.stdout += String(strVal ?? '');
          return 'cout';
        }
        return a << b;
      }
      case '>>': return a >> b;
      default: throw new Error(`Unknown operator: ${op}`);
    }
  }
}
