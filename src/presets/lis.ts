/**
 * Longest Increasing Subsequence (LIS) Pattern
 */

import type { DPPreset } from './types';

export const lisPreset: DPPreset = {
  id: 'lis',
  title: 'Longest Increasing Subsequence (LIS)',
  pattern: 'lis',
  patternName: 'Longest Increasing Subsequence',
  badge: 'LIS Pattern',
  difficulty: 'Medium',
  description:
    'Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence is strictly increasing if each element is strictly greater than the preceding element.',
  timeComplexity: 'O(N^2)',
  spaceComplexity: 'O(N)',
  reconstructionDescription: 'The exact increasing elements forming the longest sequence.',
  defaultInputs: {
    nums: [10, 9, 2, 5, 3, 7, 101, 18],
  },
  inputConfigs: [
    {
      id: 'nums',
      label: 'Number Sequence',
      type: 'number_array',
      defaultValue: [10, 9, 2, 5, 3, 7, 101, 18],
    },
  ],
  bottomUp: {
    title: 'Bottom-Up Tabulation',
    type: 'bottom_up',
    description: '1D DP array where dp[i] is the length of LIS ending at index i',
    recurrenceFormulaTemplate: 'dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i]',
    stateExplanation: 'dp[i] stores the length of the longest increasing subsequence that ends with nums[i]',
    baseCases: 'dp[i] = 1 for all i (every single element is a subsequence of length 1)',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    vector<int> dp(n, 1);
    int maxLen = 1;

    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        maxLen = max(maxLen, dp[i]);
    }

    return maxLen;
}

int main() {
    vector<int> nums = {10, 9, 2, 5, 3, 7, 101, 18};
    int ans = lengthOfLIS(nums);
    cout << "LIS Length: " << ans << endl;
    return ans;
}`,
  },
  topDown: {
    title: 'Top-Down with Memoization',
    type: 'top_down',
    description: 'Recursive state solve(currIndex, prevIndex) caching longest chain',
    recurrenceFormulaTemplate: 'solve(i, prev) = max(skip, nums[i] > nums[prev] ? 1 + take : 0)',
    stateExplanation: 'memo[i][prev + 1] caches max sequence starting at i with previous element index',
    baseCases: 'if (i == n) return 0;',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

vector<vector<int>> memo;
vector<int> nums = {10, 9, 2, 5, 3, 7, 101, 18};

int solve(int i, int prevIdx) {
    if (i == nums.size()) return 0;
    if (memo[i][prevIdx + 1] != -1) return memo[i][prevIdx + 1];

    int skip = solve(i + 1, prevIdx);
    int take = 0;
    if (prevIdx == -1 || nums[i] > nums[prevIdx]) {
        take = 1 + solve(i + 1, i);
    }

    memo[i][prevIdx + 1] = max(skip, take);
    return memo[i][prevIdx + 1];
}

int main() {
    int n = nums.size();
    memo = vector<vector<int>>(n, vector<int>(n + 1, -1));
    int ans = solve(0, -1);
    cout << "LIS (Top-Down): " << ans << endl;
    return ans;
}`,
  },
};
