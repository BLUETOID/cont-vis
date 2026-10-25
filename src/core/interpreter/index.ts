/**
 * C++ DP Interpreter Entry Point
 */

import { preprocessCpp } from './preprocessor';
import { tokenize } from './lexer';
import { Parser } from './parser';
import { Evaluator, type EvaluatorOptions } from './evaluator';
import type { DPExecutionResult } from '../../types/dp';

export function runCppDPInterpreter(
  sourceCode: string,
  options: EvaluatorOptions = {}
): DPExecutionResult {
  try {
    const preprocessed = preprocessCpp(sourceCode);
    const tokens = tokenize(preprocessed);
    const parser = new Parser(tokens);
    const ast = parser.parseProgram();
    const evaluator = new Evaluator(ast, options);
    const result = evaluator.run();

    return {
      trace: result.trace,
      stdout: result.stdout,
      finalAnswer: result.finalAnswer,
      error: result.error,
    };
  } catch (err: any) {
    return {
      trace: [],
      stdout: '',
      error: err.message || 'Syntax or runtime error during interpretation',
    };
  }
}
