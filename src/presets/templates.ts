/**
 * General C++ Data Structure & Algorithm Templates
 * Demonstrates 1D Arrays, 2D Matrices, Stacks, Queues, Maps, and Recursion
 * All idiomatic C++ competitive programming code uses cout and returns 0 from main()
 */

export interface CodeTemplate {
  id: string;
  title: string;
  category: 'array' | 'matrix' | 'stack' | 'queue' | 'map' | 'recursion' | 'scratchpad';
  description: string;
  code: string;
  defaultStdin?: string;
}

export const CODE_TEMPLATES: CodeTemplate[] = [
  {
    id: 'cpp-features',
    title: 'Modern C++ (Range-For, Assign, Emplace, Tie)',
    category: 'array',
    description: 'Demonstrates range-for loops, .assign(), .emplace_back(), .resize(), tie(a, b), and structured bindings',
    code: `#include <iostream>
#include <vector>
#include <tuple>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // 1. Vector resize and assign
    vector<int> arr;
    arr.resize(4, 10);
    arr.assign(3, 7);

    // 2. emplace_back
    arr.emplace_back(25);
    arr.emplace_back(42);

    // 3. For-each range loop
    int sum = 0;
    for (int x : arr) {
        sum += x;
        cout << "Element: " << x << endl;
    }

    // 4. Pair and tie unpacking
    pair<int, int> p = {10, 20};
    p.first = 15;
    p.second = 25;

    int a = 0, b = 0;
    tie(a, b) = p;
    cout << "tie: a=" << a << ", b=" << b << endl;

    // 5. Structured bindings
    auto [x, y] = p;
    cout << "Structured binding: x=" << x << ", y=" << y << endl;

    cout << "Total sum: " << sum << endl;
    return 0;
}
`,
  },
  {
    id: 'cin-input',
    title: 'Custom Input (cin >>)',
    category: 'array',
    description: 'Read custom input numbers via cin >> from the Input tab and visualize arrays',
    defaultStdin: '5 14 82 27 95 63',
    code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    cout << "Array size: " << n << endl;
    
    vector<int> arr(n, 0);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
        cout << "Read arr[" << i << "] = " << arr[i] << endl;
    }
    
    int maxVal = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    
    cout << "Max element: " << maxVal << endl;
    return 0;
}
`,
  },
  {
    id: 'cp-boilerplate',
    title: 'Competitive Programming (long long, STL, Min-Heap)',
    category: 'array',
    description: 'Demonstrates #define int long long, signed main(), priority_queue min-heap, lower_bound, __gcd, and all(x)',
    defaultStdin: '5\n10 25 25 40 55',
    code: `#include <bits/stdc++.h>
using namespace std;

#define int long long
#define pb push_back
#define fi first
#define se second
#define all(x) (x).begin(), (x).end()
#define sz(x) (int)(x).size()

typedef pair<int, int> pii;
using vi = vector<int>;

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n = 5;
    vi a = {10, 25, 25, 40, 55};
    
    // 1. Min-Heap Priority Queue
    priority_queue<int, vector<int>, greater<int>> min_pq;
    for (int x : a) {
        min_pq.push(x);
    }
    cout << "Min-heap top: " << min_pq.top() << endl;

    // 2. Binary search & lower_bound
    int target = 25;
    int lb_idx = lower_bound(all(a), target) - a.begin();
    int ub_idx = upper_bound(all(a), target) - a.begin();
    cout << "Target " << target << " lower_bound index: " << lb_idx << endl;
    cout << "Target " << target << " upper_bound index: " << ub_idx << endl;

    // 3. Bitwise & math builtins
    int g = __gcd(48, 18);
    int ones = __builtin_popcountll(29);
    int big_val = 1000000000LL;
    int mod = 1000000007LL;
    int product = (big_val * 2000000000LL) % mod;

    cout << "gcd(48, 18) = " << g << endl;
    cout << "popcount(29) = " << ones << endl;
    cout << "64-bit mod product = " << product << endl;

    return 0;
}
`,
  },
  {
    id: 'scratchpad',
    title: 'Blank Scratchpad',
    category: 'scratchpad',
    description: 'Write any custom C++ code to visualize data structures live',
    code: `#include <iostream>
#include <vector>
#include <stack>
#include <queue>
#include <unordered_map>
using namespace std;

int main() {
    // 1. Declare a 1D vector
    vector<int> arr = {4, 2, 7, 1, 9};
    
    // 2. Declare a stack and push elements
    stack<int> st;
    st.push(10);
    st.push(20);
    st.pop();
    
    // 3. Live scalar computation
    int sum = 0;
    for (int i = 0; i < arr.size(); i++) {
        sum += arr[i];
    }
    
    cout << "Total sum = " << sum << endl;
    return 0;
}
`,
  },
  {
    id: '1d-array-dp',
    title: '1D Array DP (Fibonacci)',
    category: 'array',
    description: 'Computes Fibonacci sequence with live pointer i moving across cells',
    code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n = 7;
    // Automatically creates interactive 1D Array Widget
    vector<int> dp(n + 1, 0);
    
    // Base cases
    dp[0] = 0;
    dp[1] = 1;
    
    // Pointer i hovers and updates cells
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        cout << "dp[" << i << "] = " << dp[i] << endl;
    }
    
    cout << "Fibonacci(" << n << ") = " << dp[n] << endl;
    return 0;
}
`,
  },
  {
    id: '2d-matrix-dp',
    title: '2D Matrix DP (0/1 Knapsack)',
    category: 'matrix',
    description: 'Visualizes 2D grid table with row/col coordinates and cell transitions',
    code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> wt = {1, 2, 3};
    vector<int> val = {6, 10, 12};
    int W = 5;
    int n = wt.size();
    
    // Automatically creates 2D Matrix Widget
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                int take = val[i - 1] + dp[i - 1][w - wt[i - 1]];
                int notTake = dp[i - 1][w];
                dp[i][w] = max(take, notTake);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    cout << "Max Knapsack Value: " << dp[n][W] << endl;
    return 0;
}
`,
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack (Next Greater Element)',
    category: 'stack',
    description: 'Displays 1D array alongside vertical cylinder stack with push/pop animations',
    code: `#include <iostream>
#include <vector>
#include <stack>
using namespace std;

int main() {
    vector<int> nums = {4, 5, 2, 10, 8};
    int n = nums.size();
    vector<int> result(n, -1);
    
    // Automatically creates Stack Widget
    stack<int> st;
    
    for (int i = 0; i < n; i++) {
        // Pop elements smaller than current
        while (!st.empty() && nums[st.top()] < nums[i]) {
            int prevIdx = st.top();
            st.pop();
            result[prevIdx] = nums[i];
        }
        st.push(i);
    }
    
    cout << "Next Greater Elements Computed: " << result[0] << endl;
    return 0;
}
`,
  },
  {
    id: 'queue-bfs',
    title: 'Queue BFS (Level-Order Flow)',
    category: 'queue',
    description: 'Visualizes horizontal FIFO queue pipe with FRONT and BACK pointers',
    code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    // Automatically creates Queue Widget with FRONT & BACK
    queue<int> q;
    vector<int> visited;
    
    // Enqueue initial nodes
    q.push(1);
    q.push(2);
    q.push(3);
    
    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        visited.push_back(curr);
        
        if (curr < 6) {
            q.push(curr * 2);
        }
    }
    
    cout << "BFS Visited count = " << visited.size() << endl;
    return 0;
}
`,
  },
  {
    id: 'frequency-map',
    title: 'Hash Map (Two Sum Lookup)',
    category: 'map',
    description: 'Renders key-value cards and fast O(1) hash map lookups',
    code: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    // Automatically creates Hash Map Widget
    unordered_map<int, int> mp;
    int foundIndex = -1;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (mp.count(complement)) {
            foundIndex = i;
            cout << "Pair found: indices " << mp[complement] << " and " << i << endl;
            break;
        }
        mp[nums[i]] = i;
    }
    
    cout << "Search complete, found index: " << foundIndex << endl;
    return 0;
}
`,
  },
  {
    id: 'recursion-tree',
    title: 'Recursion Call Tree (DFS + Memoization)',
    category: 'recursion',
    description: 'Renders dynamic recursive call DAG with instant memo cache hits',
    code: `#include <iostream>
#include <vector>
using namespace std;

vector<int> memo(15, -1);

int solve(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    
    memo[n] = solve(n - 1) + solve(n - 2);
    return memo[n];
}

int main() {
    int ans = solve(5);
    cout << "Fib(5) = " << ans << endl;
    return 0;
}
`,
  },
];

export function getTemplateById(id: string): CodeTemplate | undefined {
  return CODE_TEMPLATES.find((t) => t.id === id);
}
