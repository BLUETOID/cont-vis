import { describe, it, expect } from 'vitest';
import { reconstructBacktrackPath } from '../src/core/dp/backtracker';

describe('Solution Backtracker & Path Reconstructor', () => {
  it('reconstructs Knapsack selected items', () => {
    // 4 items (weights [2,3,4,5], values [3,4,5,8]), capacity 7
    // Table values:
    const table = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 3, 3, 3, 3, 3],
      [0, 0, 3, 4, 4, 7, 7, 7],
      [0, 0, 3, 4, 5, 7, 8, 9],
      [0, 0, 3, 4, 5, 8, 8, 11],
    ];

    const result = reconstructBacktrackPath('knapsack_01', table, {
      weights: [2, 3, 4, 5],
      values: [3, 4, 5, 8],
      capacity: 7,
    });

    expect(result.path.length).toBeGreaterThan(1);
    expect(result.solutionSummary).toContain('11');
    expect(result.solutionSummary).toContain('Item 4'); // weight 5, value 8
    expect(result.solutionSummary).toContain('Item 1'); // weight 2, value 3
  });

  it('reconstructs LCS aligned string', () => {
    const s1 = 'AGGTAB';
    const s2 = 'GXTXAYB';
    // Dummy table that satisfies LCS structure
    const table = Array.from({ length: s1.length + 1 }, () =>
      Array.from({ length: s2.length + 1 }, () => 0)
    );
    // Fill properly with DP logic for test
    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          table[i][j] = 1 + table[i - 1][j - 1];
        } else {
          table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
        }
      }
    }

    const result = reconstructBacktrackPath('lcs', table, { s1, s2 });
    expect(result.solutionSummary).toContain('"GTAB"');
  });
});
