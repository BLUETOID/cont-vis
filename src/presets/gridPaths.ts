/**
 * 2D Grid DP Patterns: Unique Paths & Minimum Path Sum
 */

import type { DPPreset } from './types';

export const uniquePathsPreset: DPPreset = {
  id: 'unique_paths',
  title: 'Unique Paths (Grid)',
  pattern: 'grid_paths',
  patternName: '2D Grid Paths',
  badge: 'Grid DP',
  difficulty: 'Medium',
  description:
    'A robot is located at the top-left corner of an m x n grid. The robot can only move either down or right at any point in time. How many possible unique paths can the robot take to reach the bottom-right corner?',
  timeComplexity: 'O(M * N)',
  spaceComplexity: 'O(M * N)',
  reconstructionDescription: 'The step coordinates traversed from (0,0) to (M-1, N-1).',
  defaultInputs: {
    m: 4,
    n: 5,
  },
  inputConfigs: [
    {
      id: 'm',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 4,
      min: 2,
      max: 8,
    },
    {
      id: 'n',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 5,
      min: 2,
      max: 8,
    },
  ],
  bottomUp: {
    title: 'Bottom-Up Tabulation',
    type: 'bottom_up',
    description: '2D grid where each cell sums paths from top and left neighbors',
    recurrenceFormulaTemplate: 'dp[r][c] = dp[r - 1][c] + dp[r][c - 1]',
    stateExplanation: 'dp[r][c] is the number of distinct paths from (0,0) to cell (r,c)',
    baseCases: 'dp[0][c] = 1 (top row) and dp[r][0] = 1 (left column)',
    cppCode: `#include <vector>
#include <iostream>
using namespace std;

int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));

    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n; c++) {
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
        }
    }

    return dp[m - 1][n - 1];
}

int main() {
    int m = 4, n = 5;
    int paths = uniquePaths(m, n);
    cout << "Unique paths in " << m << "x" << n << " grid: " << paths << endl;
    return paths;
}`,
  },
  topDown: {
    title: 'Top-Down with Memoization',
    type: 'top_down',
    description: 'Recursive path counting from target (r,c) backward to (0,0)',
    recurrenceFormulaTemplate: 'solve(r, c) = solve(r - 1, c) + solve(r, c - 1)',
    stateExplanation: 'memo[r][c] stores the cached number of paths to cell (r, c)',
    baseCases: 'if (r == 0 || c == 0) return 1;',
    cppCode: `#include <vector>
#include <iostream>
using namespace std;

vector<vector<int>> memo;

int solve(int r, int c) {
    if (r == 0 || c == 0) return 1;
    if (memo[r][c] != 0) return memo[r][c];

    memo[r][c] = solve(r - 1, c) + solve(r, c - 1);
    return memo[r][c];
}

int main() {
    int m = 4, n = 5;
    memo = vector<vector<int>>(m, vector<int>(n, 0));
    int ans = solve(m - 1, n - 1);
    cout << "Unique paths (Memoized): " << ans << endl;
    return ans;
}`,
  },
};
