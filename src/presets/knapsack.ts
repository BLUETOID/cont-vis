/**
 * Knapsack Patterns: 0/1 Knapsack & Subset Sum
 */

import type { DPPreset } from './types';

export const knapsack01Preset: DPPreset = {
  id: 'knapsack_01',
  title: '0/1 Knapsack Problem',
  pattern: 'knapsack',
  patternName: 'Knapsack DP',
  badge: '0/1 Knapsack',
  difficulty: 'Medium',
  description:
    'Given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value. Each item can be picked at most once (0 or 1 choice).',
  timeComplexity: 'O(N * W)',
  spaceComplexity: 'O(N * W)',
  reconstructionDescription: 'The exact list of items selected to maximize profit.',
  defaultInputs: {
    capacity: 7,
    weights: [2, 3, 4, 5],
    values: [3, 4, 5, 8],
  },
  inputConfigs: [
    {
      id: 'capacity',
      label: 'Knapsack Capacity (W)',
      type: 'number',
      defaultValue: 7,
      min: 1,
      max: 15,
    },
    {
      id: 'weights',
      label: 'Item Weights',
      type: 'number_array',
      defaultValue: [2, 3, 4, 5],
    },
    {
      id: 'values',
      label: 'Item Values',
      type: 'number_array',
      defaultValue: [3, 4, 5, 8],
    },
  ],
  bottomUp: {
    title: 'Bottom-Up Tabulation',
    type: 'bottom_up',
    description: '2D matrix (Items x Capacity) taking max(skip, take)',
    recurrenceFormulaTemplate: 'dp[i][w] = max(dp[i - 1][w], val[i] + dp[i - 1][w - wt[i]])',
    stateExplanation: 'dp[i][w] is max value using a subset of the first i items with capacity limit w',
    baseCases: 'dp[0][w] = 0 (no items) and dp[i][0] = 0 (zero capacity)',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int knapsack01(int W, vector<int>& wt, vector<int>& val) {
    int n = wt.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (wt[i - 1] <= w) {
                int take = val[i - 1] + dp[i - 1][w - wt[i - 1]];
                int skip = dp[i - 1][w];
                dp[i][w] = max(take, skip);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    return dp[n][W];
}

int main() {
    int W = 7;
    vector<int> wt = {2, 3, 4, 5};
    vector<int> val = {3, 4, 5, 8};

    int maxProfit = knapsack01(W, wt, val);
    cout << "Maximum profit: " << maxProfit << endl;
    return maxProfit;
}`,
  },
  topDown: {
    title: 'Top-Down with Memoization',
    type: 'top_down',
    description: 'Recursive choice tree exploring Take vs Skip, memoizing (itemIndex, capacity)',
    recurrenceFormulaTemplate: 'solve(i, w) = max(solve(i-1, w), val[i] + solve(i-1, w - wt[i]))',
    stateExplanation: 'memo[i][w] caches maximum profit from items [0..i] with capacity w',
    baseCases: 'if (i < 0 || w == 0) return 0;',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

vector<vector<int>> memo;
vector<int> wt = {2, 3, 4, 5};
vector<int> val = {3, 4, 5, 8};

int solve(int i, int w) {
    if (i < 0 || w <= 0) return 0;
    if (memo[i][w] != -1) return memo[i][w];

    int skip = solve(i - 1, w);
    int take = 0;
    if (wt[i] <= w) {
        take = val[i] + solve(i - 1, w - wt[i]);
    }

    memo[i][w] = max(skip, take);
    return memo[i][w];
}

int main() {
    int W = 7;
    int n = wt.size();
    memo = vector<vector<int>>(n, vector<int>(W + 1, -1));

    int ans = solve(n - 1, W);
    cout << "Max Profit (Memoized): " << ans << endl;
    return ans;
}`,
  },
};
