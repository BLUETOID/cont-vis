/**
 * DP Pattern Presets and Metadata Types
 */

export type DPPatternCategory =
  | 'linear_1d'
  | 'knapsack'
  | 'grid_paths'
  | 'string_dp'
  | 'lis'
  | 'interval_dp'
  | 'tree_dp';

export interface ProblemInputConfig {
  id: string;
  label: string;
  type: 'number' | 'string' | 'number_array' | 'matrix';
  defaultValue: any;
  placeholder?: string;
  min?: number;
  max?: number;
  help?: string;
}

export interface PresetVariant {
  title: string;
  type: 'bottom_up' | 'top_down';
  description: string;
  cppCode: string;
  recurrenceFormulaTemplate: string;
  stateExplanation: string;
  baseCases: string;
}

export interface DPPreset {
  id: string;
  title: string;
  pattern: DPPatternCategory;
  patternName: string;
  badge: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  defaultInputs: Record<string, any>;
  inputConfigs: ProblemInputConfig[];
  bottomUp: PresetVariant;
  topDown: PresetVariant;
  timeComplexity: string;
  spaceComplexity: string;
  reconstructionDescription: string;
}
