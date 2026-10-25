import { describe, it, expect } from 'vitest';
import { runCppDPInterpreter } from '../src/core/interpreter';
import { climbingStairsPreset, coinChangePreset } from '../src/presets/linear1d';
import { knapsack01Preset } from '../src/presets/knapsack';
import { uniquePathsPreset } from '../src/presets/gridPaths';
import { lcsPreset } from '../src/presets/stringDp';
import { lisPreset } from '../src/presets/lis';
import { intervalDpPreset } from '../src/presets/intervalDp';
import { treeDpPreset } from '../src/presets/treeDp';

describe('7 Major Dynamic Programming Patterns', () => {
  it('Pattern 1: Climbing Stairs (Bottom-Up & Top-Down)', () => {
    const resBottomUp = runCppDPInterpreter(climbingStairsPreset.bottomUp.cppCode);
    expect(resBottomUp.error).toBeUndefined();
    expect(resBottomUp.finalAnswer).toBe(13); // fib(6+1) = 13 distinct ways

    const resTopDown = runCppDPInterpreter(climbingStairsPreset.topDown.cppCode);
    expect(resTopDown.error).toBeUndefined();
    expect(resTopDown.finalAnswer).toBe(13);
  });

  it('Pattern 1: Coin Change (Bottom-Up & Top-Down)', () => {
    const resBottomUp = runCppDPInterpreter(coinChangePreset.bottomUp.cppCode);
    expect(resBottomUp.error).toBeUndefined();
    expect(resBottomUp.finalAnswer).toBe(3); // 5 + 5 + 1 = 3 coins

    const resTopDown = runCppDPInterpreter(coinChangePreset.topDown.cppCode);
    expect(resTopDown.error).toBeUndefined();
    expect(resTopDown.finalAnswer).toBe(3);
  });

  it('Pattern 2: 0/1 Knapsack (Bottom-Up & Top-Down)', () => {
    const resBottomUp = runCppDPInterpreter(knapsack01Preset.bottomUp.cppCode);
    expect(resBottomUp.error).toBeUndefined();
    // wt=[2,3,4,5], val=[3,4,5,8], W=7 -> take wt 2 & 5 (val 3 + 8 = 11)
    expect(resBottomUp.finalAnswer).toBe(11);

    const resTopDown = runCppDPInterpreter(knapsack01Preset.topDown.cppCode);
    expect(resTopDown.error).toBeUndefined();
    expect(resTopDown.finalAnswer).toBe(11);
  });

  it('Pattern 3: 2D Grid Unique Paths (Bottom-Up & Top-Down)', () => {
    const resBottomUp = runCppDPInterpreter(uniquePathsPreset.bottomUp.cppCode);
    expect(resBottomUp.error).toBeUndefined();
    // 4x5 grid paths = C(3+4, 3) = C(7, 3) = 35
    expect(resBottomUp.finalAnswer).toBe(35);

    const resTopDown = runCppDPInterpreter(uniquePathsPreset.topDown.cppCode);
    expect(resTopDown.error).toBeUndefined();
    expect(resTopDown.finalAnswer).toBe(35);
  });

  it('Pattern 4: Longest Common Subsequence (Bottom-Up & Top-Down)', () => {
    const resBottomUp = runCppDPInterpreter(lcsPreset.bottomUp.cppCode);
    expect(resBottomUp.error).toBeUndefined();
    // "AGGTAB" and "GXTXAYB" -> "GTAB" (length 4)
    expect(resBottomUp.finalAnswer).toBe(4);

    const resTopDown = runCppDPInterpreter(lcsPreset.topDown.cppCode);
    expect(resTopDown.error).toBeUndefined();
    expect(resTopDown.finalAnswer).toBe(4);
  });

  it('Pattern 5: Longest Increasing Subsequence (Bottom-Up & Top-Down)', () => {
    const resBottomUp = runCppDPInterpreter(lisPreset.bottomUp.cppCode);
    expect(resBottomUp.error).toBeUndefined();
    // [10, 9, 2, 5, 3, 7, 101, 18] -> [2, 3, 7, 101] (length 4)
    expect(resBottomUp.finalAnswer).toBe(4);

    const resTopDown = runCppDPInterpreter(lisPreset.topDown.cppCode);
    expect(resTopDown.error).toBeUndefined();
    expect(resTopDown.finalAnswer).toBe(4);
  });

  it('Pattern 6: Interval DP / Matrix Chain Multiplication (Bottom-Up & Top-Down)', () => {
    const resBottomUp = runCppDPInterpreter(intervalDpPreset.bottomUp.cppCode);
    expect(resBottomUp.error).toBeUndefined();
    // [10, 20, 30, 40, 30] -> min multiplications: 30000
    expect(resBottomUp.finalAnswer).toBe(30000);

    const resTopDown = runCppDPInterpreter(intervalDpPreset.topDown.cppCode);
    expect(resTopDown.error).toBeUndefined();
    expect(resTopDown.finalAnswer).toBe(30000);
  });

  it('Pattern 7: Tree DP / House Robber III (Bottom-Up & Top-Down)', () => {
    const resBottomUp = runCppDPInterpreter(treeDpPreset.bottomUp.cppCode);
    expect(resBottomUp.error).toBeUndefined();
    // Tree root=3 (rob 3 + 3 + 1 = 7)
    expect(resBottomUp.finalAnswer).toBe(7);

    const resTopDown = runCppDPInterpreter(treeDpPreset.topDown.cppCode);
    expect(resTopDown.error).toBeUndefined();
    expect(resTopDown.finalAnswer).toBe(7);
  });
});
