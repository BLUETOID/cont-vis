/**
 * Unified DP Patterns Preset Catalog
 */

import type { DPPreset, DPPatternCategory } from './types';
import { climbingStairsPreset, coinChangePreset } from './linear1d';
import { knapsack01Preset } from './knapsack';
import { uniquePathsPreset } from './gridPaths';
import { lcsPreset } from './stringDp';
import { lisPreset } from './lis';
import { intervalDpPreset } from './intervalDp';
import { treeDpPreset } from './treeDp';

export const DP_PRESETS: DPPreset[] = [
  climbingStairsPreset,
  coinChangePreset,
  knapsack01Preset,
  uniquePathsPreset,
  lcsPreset,
  lisPreset,
  intervalDpPreset,
  treeDpPreset,
];

export const PATTERN_CATEGORIES: { id: DPPatternCategory; label: string; icon: string }[] = [
  { id: 'linear_1d', label: '1D Linear DP', icon: 'MoveRight' },
  { id: 'knapsack', label: 'Knapsack DP', icon: 'Package' },
  { id: 'grid_paths', label: '2D Grid Paths', icon: 'Grid' },
  { id: 'string_dp', label: 'String / Two-Sequence', icon: 'Type' },
  { id: 'lis', label: 'LIS Subsequence', icon: 'TrendingUp' },
  { id: 'interval_dp', label: 'Interval DP', icon: 'Layers' },
  { id: 'tree_dp', label: 'Tree DP', icon: 'GitFork' },
];

export function getPresetById(id: string): DPPreset | undefined {
  return DP_PRESETS.find((p) => p.id === id);
}

export function getPresetsByCategory(category: DPPatternCategory): DPPreset[] {
  return DP_PRESETS.filter((p) => p.pattern === category);
}
