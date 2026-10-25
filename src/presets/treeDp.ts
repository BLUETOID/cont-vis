/**
 * Tree DP Pattern: House Robber III / Subtree DP
 */

import type { DPPreset } from './types';

export const treeDpPreset: DPPreset = {
  id: 'house_robber_3',
  title: 'House Robber III (Tree DP)',
  pattern: 'tree_dp',
  patternName: 'Tree DP / Subtree DP',
  badge: 'Tree DP',
  difficulty: 'Medium',
  description:
    'The thief has found himself a new place for his thievery again. There is only one entrance to this area, called root. Besides the root, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree. It will automatically contact the police if two directly-linked houses were broken into on the same night.',
  timeComplexity: 'O(N)',
  spaceComplexity: 'O(N)',
  reconstructionDescription: 'The subset of tree nodes chosen to maximize robbed value.',
  defaultInputs: {
    treeValues: [3, 2, 3, 3, 1],
  },
  inputConfigs: [
    {
      id: 'treeValues',
      label: 'Tree Node Values (BFS level-order)',
      type: 'number_array',
      defaultValue: [3, 2, 3, 3, 1],
      help: 'Array representing binary tree values [root, left, right, left-left, left-right]',
    },
  ],
  bottomUp: {
    title: 'Bottom-Up Post-Order DP',
    type: 'bottom_up',
    description: 'Post-order traversal returning pair {robRoot, skipRoot} for every subtree',
    recurrenceFormulaTemplate: 'rob = val + skip(L) + skip(R); skip = max(L) + max(R)',
    stateExplanation: 'For each node, compute (1) max profit if robbed, (2) max profit if skipped',
    baseCases: 'if node is null, return {0, 0}',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

// Representation of binary tree nodes:
// Node 0: val=3 (root), Left: Node 1 (val=2), Right: Node 2 (val=3)
// Node 1 Left: Node 3 (val=3), Node 1 Right: Node 4 (val=1)
vector<int> val = {3, 2, 3, 3, 1};
vector<int> leftChild = {1, 3, -1, -1, -1};
vector<int> rightChild = {2, 4, -1, -1, -1};

// dp[node][0] = skip node, dp[node][1] = rob node
vector<vector<int>> dp(5, vector<int>(2, 0));

void postOrderDP(int u) {
    if (u == -1) return;

    int left = leftChild[u];
    int right = rightChild[u];

    postOrderDP(left);
    postOrderDP(right);

    int leftSkip = left != -1 ? dp[left][0] : 0;
    int leftRob = left != -1 ? dp[left][1] : 0;
    int rightSkip = right != -1 ? dp[right][0] : 0;
    int rightRob = right != -1 ? dp[right][1] : 0;

    // Rob current node: cannot rob children
    dp[u][1] = val[u] + leftSkip + rightSkip;

    // Skip current node: can choose to rob or skip either child
    int bestLeft = max(leftSkip, leftRob);
    int bestRight = max(rightSkip, rightRob);
    dp[u][0] = bestLeft + bestRight;
}

int main() {
    postOrderDP(0);
    int maxMoney = max(dp[0][0], dp[0][1]);
    cout << "Max money robbed from tree: " << maxMoney << endl;
    return maxMoney;
}`,
  },
  topDown: {
    title: 'Top-Down with Memoization',
    type: 'top_down',
    description: 'Recursive dfs(node, canRob) with memoization table',
    recurrenceFormulaTemplate: 'dfs(u, true) = max(val + dfs(children, false), dfs(children, true))',
    stateExplanation: 'memo[u][canRob] caches max profit from subtree u with permission flag',
    baseCases: 'if (u == -1) return 0;',
    cppCode: `#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

vector<int> val = {3, 2, 3, 3, 1};
vector<int> leftChild = {1, 3, -1, -1, -1};
vector<int> rightChild = {2, 4, -1, -1, -1};

// memo[node][canRob]
vector<vector<int>> memo(5, vector<int>(2, -1));

int robSubtree(int u, int canRob) {
    if (u == -1) return 0;
    if (memo[u][canRob] != -1) return memo[u][canRob];

    int left = leftChild[u];
    int right = rightChild[u];

    // Choice 1: Do not rob node u
    int skip = robSubtree(left, 1) + robSubtree(right, 1);

    // Choice 2: Rob node u (only allowed if canRob is true)
    int rob = 0;
    if (canRob == 1) {
        rob = val[u] + robSubtree(left, 0) + robSubtree(right, 0);
    }

    memo[u][canRob] = max(skip, rob);
    return memo[u][canRob];
}

int main() {
    int maxMoney = robSubtree(0, 1);
    cout << "Max money (Top-Down): " << maxMoney << endl;
    return maxMoney;
}`,
  },
};
