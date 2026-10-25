/**
 * Interval DP Pattern: Matrix Chain Multiplication
 */

import type { DPPreset } from './types';

export const intervalDpPreset: DPPreset = {
  id: 'matrix_chain_multiplication',
  title: 'Matrix Chain Multiplication',
  pattern: 'interval_dp',
  patternName: 'Interval DP',
  badge: 'Interval DP',
  difficulty: 'Hard',
  description:
    'Given a sequence of matrices, find the most efficient way to multiply these matrices together. The problem is not actually to perform the multiplications, but merely to decide in which order to perform the multiplications.',
  timeComplexity: 'O(N^3)',
  spaceComplexity: 'O(N^2)',
  reconstructionDescription: 'The optimal parenthesization of matrices e.g. ((A(BC))D).',
  defaultInputs: {
    dimensions: [10, 20, 30, 40, 30],
  },
  inputConfigs: [
    {
      id: 'dimensions',
      label: 'Matrix Dimension Array (dims)',
      type: 'number_array',
      defaultValue: [10, 20, 30, 40, 30],
      help: 'Array where matrix i has dimensions dims[i-1] x dims[i]',
    },
  ],
  bottomUp: {
    title: 'Bottom-Up Tabulation',
    type: 'bottom_up',
    description: 'Upper-triangular DP matrix iterating through chain lengths L = 2 to N',
    recurrenceFormulaTemplate: 'dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]) for i <= k < j',
    stateExplanation: 'dp[i][j] is the minimum scalar multiplications needed to multiply matrices from i to j',
    baseCases: 'dp[i][i] = 0 (single matrix requires 0 multiplications)',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int matrixChainOrder(vector<int>& p) {
    int n = p.size();
    vector<vector<int>> dp(n, vector<int>(n, 0));

    // L is chain length
    for (int L = 2; L < n; L++) {
        for (int i = 1; i < n - L + 1; i++) {
            int j = i + L - 1;
            dp[i][j] = 1e9;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }

    return dp[1][n - 1];
}

int main() {
    vector<int> p = {10, 20, 30, 40, 30};
    int minOps = matrixChainOrder(p);
    cout << "Min Multiplications: " << minOps << endl;
    return minOps;
}`,
  },
  topDown: {
    title: 'Top-Down with Memoization',
    type: 'top_down',
    description: 'Recursive interval division solve(i, j) trying all split positions k',
    recurrenceFormulaTemplate: 'solve(i, j) = min_{k} (solve(i, k) + solve(k+1, j) + p[i-1]*p[k]*p[j])',
    stateExplanation: 'memo[i][j] caches minimum operations for subchain i..j',
    baseCases: 'if (i >= j) return 0;',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

vector<vector<int>> memo;
vector<int> p = {10, 20, 30, 40, 30};

int solve(int i, int j) {
    if (i >= j) return 0;
    if (memo[i][j] != -1) return memo[i][j];

    int minCost = 1e9;
    for (int k = i; k < j; k++) {
        int cost = solve(i, k) + solve(k + 1, j) + p[i - 1] * p[k] * p[j];
        minCost = min(minCost, cost);
    }

    memo[i][j] = minCost;
    return memo[i][j];
}

int main() {
    int n = p.size();
    memo = vector<vector<int>>(n, vector<int>(n, -1));
    int ans = solve(1, n - 1);
    cout << "Min Multiplications (Top-Down): " << ans << endl;
    return ans;
}`,
  },
};
