import { describe, it, expect } from 'vitest';
import { tokenize } from '../src/core/interpreter/lexer';
import { Parser } from '../src/core/interpreter/parser';
import { Evaluator } from '../src/core/interpreter/evaluator';
import { runCppDPInterpreter } from '../src/core/interpreter';

describe('C++ DP Interpreter Subsystem', () => {
  it('tokenizes multi-dimensional array access and operators', () => {
    const code = `vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));`;
    const tokens = tokenize(code);
    expect(tokens.length).toBeGreaterThan(5);
    expect(tokens[0].value).toBe('vector');
    expect(tokens.some((t) => t.value === 'dp')).toBe(true);
  });

  it('parses recursive functions and for-loops into an AST', () => {
    const code = `
      int solve(int i, int w) {
        if (i < 0) return 0;
        return max(solve(i - 1, w), 5);
      }
    `;
    const tokens = tokenize(code);
    const parser = new Parser(tokens);
    const ast = parser.parseProgram();

    expect(ast.type).toBe('Program');
    expect(ast.body.length).toBe(1);
    expect(ast.body[0].type).toBe('FunctionDeclaration');
  });

  it('evaluates basic 1D DP table generation', () => {
    const code = `
      int main() {
        vector<int> dp(5, 0);
        dp[0] = 1;
        dp[1] = 1;
        for (int i = 2; i < 5; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[4];
      }
    `;
    const result = runCppDPInterpreter(code);
    expect(result.error).toBeUndefined();
    expect(result.finalAnswer).toBe(5);
    expect(result.trace.length).toBeGreaterThan(3);
  });

  it('intercepts reads to DP table as read dependencies', () => {
    const code = `
      int main() {
        vector<int> dp(3, 1);
        dp[2] = dp[0] + dp[1];
        return dp[2];
      }
    `;
    const result = runCppDPInterpreter(code);
    expect(result.finalAnswer).toBe(2);

    // Find the update step for dp[2]
    const updateStep = result.trace.find(
      (s) => s.dpTable?.activeCell?.newVal === 2
    );
    expect(updateStep).toBeDefined();
    expect(updateStep?.dpTable?.readDependencies.length).toBeGreaterThanOrEqual(1);
  });
});
