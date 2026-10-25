/**
 * 1D Linear DP Patterns: Climbing Stairs & Coin Change
 */

import type { DPPreset } from './types';

export const climbingStairsPreset: DPPreset = {
  id: 'climbing_stairs',
  title: 'Climbing Stairs',
  pattern: 'linear_1d',
  patternName: '1D Linear DP',
  badge: 'Linear 1D',
  difficulty: 'Easy',
  description:
    'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
  timeComplexity: 'O(N)',
  spaceComplexity: 'O(N) or O(1)',
  reconstructionDescription: 'The sequence of steps that sum up to N.',
  defaultInputs: {
    n: 6,
  },
  inputConfigs: [
    {
      id: 'n',
      label: 'Number of Steps (n)',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 20,
      help: 'Total staircase height',
    },
  ],
  bottomUp: {
    title: 'Bottom-Up Tabulation',
    type: 'bottom_up',
    description: 'Iterative 1D table where dp[i] = dp[i-1] + dp[i-2]',
    recurrenceFormulaTemplate: 'dp[i] = dp[i - 1] + dp[i - 2]',
    stateExplanation: 'dp[i] is the number of distinct ways to reach step i',
    baseCases: 'dp[0] = 1, dp[1] = 1',
    cppCode: `#include <vector>
#include <iostream>
using namespace std;

int climbStairs(int n) {
    if (n <= 1) return 1;
    vector<int> dp(n + 1, 0);
    dp[0] = 1;
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}

int main() {
    int n = 6;
    int ways = climbStairs(n);
    cout << "Total ways to climb " << n << " steps: " << ways << endl;
    return ways;
}`,
  },
  topDown: {
    title: 'Top-Down with Memoization',
    type: 'top_down',
    description: 'Recursive depth-first search with memo array to prune overlapping subproblems',
    recurrenceFormulaTemplate: 'solve(n) = solve(n - 1) + solve(n - 2)',
    stateExplanation: 'memo[n] caches the return value of solve(n)',
    baseCases: 'if (n <= 1) return 1;',
    cppCode: `#include <vector>
#include <iostream>
using namespace std;

vector<int> memo;

int solve(int n) {
    if (n <= 1) return 1;
    if (memo[n] != 0) return memo[n];

    memo[n] = solve(n - 1) + solve(n - 2);
    return memo[n];
}

int main() {
    int n = 6;
    memo = vector<int>(n + 1, 0);
    int ways = solve(n);
    cout << "Total ways: " << ways << endl;
    return ways;
}`,
  },
};

export const coinChangePreset: DPPreset = {
  id: 'coin_change',
  title: 'Coin Change (Min Coins)',
  pattern: 'linear_1d',
  patternName: '1D Linear DP',
  badge: 'Linear 1D',
  difficulty: 'Medium',
  description:
    'Given coins of different denominations and a total amount of money, compute the fewest number of coins that you need to make up that amount.',
  timeComplexity: 'O(Amount * NumCoins)',
  spaceComplexity: 'O(Amount)',
  reconstructionDescription: 'The exact coins used to produce the minimum total count.',
  defaultInputs: {
    amount: 11,
    coins: [1, 2, 5],
  },
  inputConfigs: [
    {
      id: 'amount',
      label: 'Target Amount',
      type: 'number',
      defaultValue: 11,
      min: 1,
      max: 25,
    },
    {
      id: 'coins',
      label: 'Coin Denominations',
      type: 'number_array',
      defaultValue: [1, 2, 5],
    },
  ],
  bottomUp: {
    title: 'Bottom-Up Tabulation',
    type: 'bottom_up',
    description: 'Iterative 1D table where dp[i] = min(dp[i - c] + 1) for coin c <= i',
    recurrenceFormulaTemplate: 'dp[i] = min(dp[i], dp[i - coin] + 1)',
    stateExplanation: 'dp[i] is the minimum number of coins needed to make amount i',
    baseCases: 'dp[0] = 0; all other dp[i] = amount + 1',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    int INF = amount + 1;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {
        for (int c : coins) {
            if (i >= c) {
                dp[i] = min(dp[i], dp[i - c] + 1);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}

int main() {
    vector<int> coins = {1, 2, 5};
    int amount = 11;
    int minCoins = coinChange(coins, amount);
    cout << "Fewest coins needed for " << amount << ": " << minCoins << endl;
    return minCoins;
}`,
  },
  topDown: {
    title: 'Top-Down with Memoization',
    type: 'top_down',
    description: 'Recursive branching exploring each coin choice, memoizing visited amounts',
    recurrenceFormulaTemplate: 'solve(rem) = 1 + min(solve(rem - coin))',
    stateExplanation: 'memo[rem] stores fewest coins for remaining amount rem',
    baseCases: 'if (rem == 0) return 0; if (rem < 0) return INF;',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

vector<int> memo;
vector<int> coins = {1, 2, 5};
int INF = 1000;

int solve(int rem) {
    if (rem == 0) return 0;
    if (rem < 0) return INF;
    if (memo[rem] != -1) return memo[rem];

    int best = INF;
    for (int c : coins) {
        if (rem >= c) {
            best = min(best, 1 + solve(rem - c));
        }
    }

    memo[rem] = best;
    return memo[rem];
}

int main() {
    int amount = 11;
    memo = vector<int>(amount + 1, -1);
    int ans = solve(amount);
    cout << "Min coins for " << amount << ": " << ans << endl;
    return ans;
}`,
  },
};
