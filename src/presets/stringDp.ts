/**
 * String / Two-Sequence DP Patterns: LCS & Edit Distance
 */

import type { DPPreset } from './types';

export const lcsPreset: DPPreset = {
  id: 'lcs',
  title: 'Longest Common Subsequence (LCS)',
  pattern: 'string_dp',
  patternName: 'String / Two-Sequence DP',
  badge: 'String DP',
  difficulty: 'Medium',
  description:
    'Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.',
  timeComplexity: 'O(M * N)',
  spaceComplexity: 'O(M * N)',
  reconstructionDescription: 'The exact aligned subsequence string.',
  defaultInputs: {
    s1: 'AGGTAB',
    s2: 'GXTXAYB',
  },
  inputConfigs: [
    {
      id: 's1',
      label: 'First String (s1)',
      type: 'string',
      defaultValue: 'AGGTAB',
    },
    {
      id: 's2',
      label: 'Second String (s2)',
      type: 'string',
      defaultValue: 'GXTXAYB',
    },
  ],
  bottomUp: {
    title: 'Bottom-Up Tabulation',
    type: 'bottom_up',
    description: '2D matrix comparing characters: match diagonal + 1 vs max(up, left)',
    recurrenceFormulaTemplate: 's1[i-1] == s2[j-1] ? 1 + dp[i-1][j-1] : max(dp[i-1][j], dp[i][j-1])',
    stateExplanation: 'dp[i][j] is the length of LCS between prefixes s1[0..i-1] and s2[0..j-1]',
    baseCases: 'dp[0][j] = 0 and dp[i][0] = 0 (empty prefix)',
    cppCode: `#include <vector>
#include <string>
#include <iostream>
#include <algorithm>
using namespace std;

int longestCommonSubsequence(string s1, string s2) {
    int m = s1.length();
    int n = s2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];
}

int main() {
    string s1 = "AGGTAB";
    string s2 = "GXTXAYB";
    int ans = longestCommonSubsequence(s1, s2);
    cout << "LCS length: " << ans << endl;
    return ans;
}`,
  },
  topDown: {
    title: 'Top-Down with Memoization',
    type: 'top_down',
    description: 'Recursive comparison of string suffixes or prefixes with memo cache',
    recurrenceFormulaTemplate: 'solve(i, j) = match ? 1 + solve(i-1, j-1) : max(solve(i-1, j), solve(i, j-1))',
    stateExplanation: 'memo[i][j] caches the LCS length for s1[0..i] and s2[0..j]',
    baseCases: 'if (i < 0 || j < 0) return 0;',
    cppCode: `#include <vector>
#include <string>
#include <iostream>
#include <algorithm>
using namespace std;

vector<vector<int>> memo;
string s1 = "AGGTAB";
string s2 = "GXTXAYB";

int solve(int i, int j) {
    if (i < 0 || j < 0) return 0;
    if (memo[i][j] != -1) return memo[i][j];

    if (s1[i] == s2[j]) {
        memo[i][j] = 1 + solve(i - 1, j - 1);
    } else {
        memo[i][j] = max(solve(i - 1, j), solve(i, j - 1));
    }

    return memo[i][j];
}

int main() {
    int m = s1.length();
    int n = s2.length();
    memo = vector<vector<int>>(m, vector<int>(n, -1));
    int ans = solve(m - 1, n - 1);
    cout << "LCS (Top-Down): " << ans << endl;
    return ans;
}`,
  },
};
