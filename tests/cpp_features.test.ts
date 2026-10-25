import { describe, it, expect } from 'vitest';
import { runCppDPInterpreter } from '../src/core/interpreter';

describe('Comprehensive C++ Language & STL Features', () => {
  it('should evaluate range-for loops over vectors', () => {
    const code = `
      #include <iostream>
      #include <vector>
      using namespace std;
      int main() {
        vector<int> nums = {10, 20, 30};
        int sum = 0;
        for (int x : nums) {
          sum += x;
        }
        cout << "Sum: " << sum << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('Sum: 60');
    expect(res.finalAnswer).toBe(0);
  });

  it('should handle range-for with break and continue', () => {
    const code = `
      #include <iostream>
      #include <vector>
      using namespace std;
      int main() {
        vector<int> nums = {1, 2, 3, 4, 5, 6};
        int oddSum = 0;
        for (auto x : nums) {
          if (x > 4) break;
          if (x % 2 == 0) continue;
          oddSum += x;
        }
        cout << "OddSum: " << oddSum << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('OddSum: 4');
  });

  it('should support vector.assign() and vector.resize()', () => {
    const code = `
      #include <iostream>
      #include <vector>
      using namespace std;
      int main() {
        vector<int> arr;
        arr.resize(5, 42);
        cout << "After resize: size=" << arr.size() << " arr[0]=" << arr[0] << endl;

        arr.assign(3, 99);
        cout << "After assign: size=" << arr.size() << " arr[2]=" << arr[2] << endl;

        arr.resize(2);
        cout << "After shrink: size=" << arr.size() << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('After resize: size=5 arr[0]=42');
    expect(res.stdout).toContain('After assign: size=3 arr[2]=99');
    expect(res.stdout).toContain('After shrink: size=2');
  });

  it('should support vector.emplace_back() and stack/queue .emplace()', () => {
    const code = `
      #include <iostream>
      #include <vector>
      #include <stack>
      #include <queue>
      using namespace std;
      int main() {
        vector<int> v;
        v.emplace_back(100);
        v.emplace_back(200);

        stack<int> st;
        st.emplace(10);
        st.emplace(20);

        queue<int> q;
        q.emplace(5);
        q.emplace(15);

        cout << "v[1]=" << v[1] << " st.top=" << st.top() << " q.front=" << q.front() << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('v[1]=200 st.top=20 q.front=5');
  });

  it('should support pair declaration, member access, and mutation', () => {
    const code = `
      #include <iostream>
      #include <utility>
      using namespace std;
      int main() {
        pair<int, int> p = {10, 20};
        cout << "p.first=" << p.first << " p.second=" << p.second << endl;

        p.first = 50;
        p.second = 90;
        cout << "after mutate: p.first=" << p.first << " p.second=" << p.second << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('p.first=10 p.second=20');
    expect(res.stdout).toContain('after mutate: p.first=50 p.second=90');
  });

  it('should support structured bindings auto [u, v]', () => {
    const code = `
      #include <iostream>
      #include <utility>
      using namespace std;
      int main() {
        pair<int, int> p = {7, 14};
        auto [u, v] = p;
        cout << "u=" << u << " v=" << v << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('u=7 v=14');
  });

  it('should support range-for with structured bindings for (auto [u, v] : items)', () => {
    const code = `
      #include <iostream>
      #include <vector>
      #include <utility>
      using namespace std;
      int main() {
        vector<pair<int, int>> edges;
        edges.emplace_back(1, 10);
        edges.emplace_back(2, 20);

        int totalWeight = 0;
        for (auto [u, w] : edges) {
          totalWeight += w;
          cout << "Edge node " << u << " weight " << w << endl;
        }
        cout << "TotalWeight: " << totalWeight << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('Edge node 1 weight 10');
    expect(res.stdout).toContain('Edge node 2 weight 20');
    expect(res.stdout).toContain('TotalWeight: 30');
  });

  it('should support tie(a, b) assignment unpacking', () => {
    const code = `
      #include <iostream>
      #include <tuple>
      using namespace std;
      int main() {
        pair<int, int> p = {100, 200};
        int a = 0;
        int b = 0;
        tie(a, b) = p;
        cout << "tie result: a=" << a << " b=" << b << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('tie result: a=100 b=200');
  });

  it('should support swap(a, b) and swap(arr[i], arr[j])', () => {
    const code = `
      #include <iostream>
      #include <vector>
      #include <algorithm>
      using namespace std;
      int main() {
        int x = 5, y = 10;
        swap(x, y);
        cout << "x=" << x << " y=" << y << endl;

        vector<int> arr = {1, 9};
        swap(arr[0], arr[1]);
        cout << "arr[0]=" << arr[0] << " arr[1]=" << arr[1] << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('x=10 y=5');
    expect(res.stdout).toContain('arr[0]=9 arr[1]=1');
  });

  it('should support sort() and reverse() with begin() and end()', () => {
    const code = `
      #include <iostream>
      #include <vector>
      #include <algorithm>
      using namespace std;
      int main() {
        vector<int> arr = {5, 2, 8, 1, 9};
        sort(arr.begin(), arr.end());
        cout << "Sorted: " << arr[0] << " " << arr[4] << endl;

        reverse(arr.begin(), arr.end());
        cout << "Reversed: " << arr[0] << " " << arr[4] << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('Sorted: 1 9');
    expect(res.stdout).toContain('Reversed: 9 1');
  });

  it('should safely execute Fast I/O lines without errors', () => {
    const code = `
      #include <iostream>
      using namespace std;
      int main() {
        ios_base::sync_with_stdio(false);
        cin.tie(NULL);
        cout.tie(0);
        cout << "Fast IO success" << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('Fast IO success');
  });

  it('should support cin >> reading into pair members', () => {
    const code = `
      #include <iostream>
      #include <utility>
      using namespace std;
      int main() {
        pair<int, int> p;
        cin >> p.first >> p.second;
        cout << "Read pair: " << p.first << ", " << p.second << endl;
        return 0;
      }
    `;
    const res = runCppDPInterpreter(code, { stdin: '33 77' });
    expect(res.error).toBeUndefined();
    expect(res.stdout).toContain('Read pair: 33, 77');
  });

  describe('Competitive Programming Extensions & Idioms', () => {
    it('should support long long declarations and literal suffixes (1LL, 1e18, 1000000007LL)', () => {
      const code = `
        #include <iostream>
        using namespace std;
        int main() {
          long long x = 1000000000LL;
          long long y = 2000000000LL;
          long long sum = x + y;
          long long big = 1e18;
          long long mod = 1000000007LL;
          long long rem = (x * y) % mod;
          cout << "sum=" << sum << " mod=" << rem << " big=" << (big > sum) << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('sum=3000000000 mod=98 big=1');
    });

    it('should support #define int long long with signed main() and int32_t main()', () => {
      const code = `
        #include <bits/stdc++.h>
        using namespace std;
        #define int long long
        signed main() {
          int a = 5;
          int b = 10;
          cout << "Product: " << a * b << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('Product: 50');
    });

    it('should support typedef, using aliases, and custom macros (pb, fi, se, all, sz)', () => {
      const code = `
        #include <bits/stdc++.h>
        using namespace std;
        typedef long long ll;
        typedef pair<int, int> pii;
        using vi = vector<int>;
        #define pb push_back
        #define fi first
        #define se second
        #define all(x) x.begin(), x.end()
        #define sz(x) (int)(x).size()

        int main() {
          ll val = 42LL;
          pii p = {7, 9};
          vi v;
          v.pb(10);
          v.pb(20);
          sort(all(v));
          cout << "val=" << val << " p=" << p.fi << "," << p.se << " sz=" << sz(v) << " v[0]=" << v[0] << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('val=42 p=7,9 sz=2 v[0]=10');
    });

    it('should support C-style casts and functional casts', () => {
      const code = `
        #include <iostream>
        #include <vector>
        using namespace std;
        int main() {
          vector<int> v = {1, 2, 3};
          int n = (int)v.size();
          long long ll_n = (long long)n;
          int cast_func = int(4.8);
          cout << "n=" << n << " ll_n=" << ll_n << " cast=" << cast_func << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('n=3 ll_n=3 cast=4');
    });

    it('should support priority_queue (max-heap and min-heap with greater<int>)', () => {
      const code = `
        #include <iostream>
        #include <queue>
        using namespace std;
        int main() {
          // Max-heap
          priority_queue<int> max_pq;
          max_pq.push(10);
          max_pq.push(30);
          max_pq.push(20);
          int top_max = max_pq.top();
          max_pq.pop();

          // Min-heap
          priority_queue<int, vector<int>, greater<int>> min_pq;
          min_pq.push(10);
          min_pq.push(30);
          min_pq.push(20);
          int top_min = min_pq.top();
          min_pq.pop();

          cout << "max_top=" << top_max << " min_top=" << top_min << " next_min=" << min_pq.top() << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('max_top=30 min_top=10 next_min=20');
    });

    it('should support deque (push_front, push_back, pop_front, indexing)', () => {
      const code = `
        #include <iostream>
        #include <deque>
        using namespace std;
        int main() {
          deque<int> dq;
          dq.push_back(2);
          dq.push_front(1);
          dq.push_back(3);
          cout << "front=" << dq.front() << " back=" << dq.back() << " dq[1]=" << dq[1] << endl;
          dq.pop_front();
          cout << "new_front=" << dq.front() << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('front=1 back=3 dq[1]=2');
      expect(res.stdout).toContain('new_front=2');
    });

    it('should support set and multiset (insert, count, erase, size)', () => {
      const code = `
        #include <iostream>
        #include <set>
        using namespace std;
        int main() {
          set<int> s;
          s.insert(5);
          s.insert(2);
          s.insert(5);
          cout << "s.count(5)=" << s.count(5) << " s.size=" << s.size() << endl;

          multiset<int> ms;
          ms.insert(5);
          ms.insert(5);
          ms.insert(2);
          cout << "ms.count(5)=" << ms.count(5) << " ms.size=" << ms.size() << endl;
          ms.erase(5);
          cout << "after erase ms.size=" << ms.size() << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('s.count(5)=1 s.size=2');
      expect(res.stdout).toContain('ms.count(5)=2 ms.size=3');
      expect(res.stdout).toContain('after erase ms.size=1');
    });

    it('should support memset with sizeof for 1D and 2D arrays', () => {
      const code = `
        #include <iostream>
        #include <cstring>
        using namespace std;
        int dp1[5];
        int dp2[3][3];
        int main() {
          memset(dp1, -1, sizeof(dp1));
          memset(dp2, 0, sizeof(dp2));
          cout << "dp1: " << dp1[0] << " " << dp1[4] << endl;
          cout << "dp2: " << dp2[1][1] << " " << dp2[2][2] << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('dp1: -1 -1');
      expect(res.stdout).toContain('dp2: 0 0');
    });

    it('should support CP built-ins: __gcd, lcm, __builtin_popcount, __builtin_clz', () => {
      const code = `
        #include <iostream>
        #include <numeric>
        using namespace std;
        int main() {
          int g = __gcd(24, 36);
          int l = lcm(12, 18);
          int pc = __builtin_popcount(29); // 29 is 11101 in binary -> 4 ones
          int pcll = __builtin_popcountll(7); // 3 ones
          cout << "gcd=" << g << " lcm=" << l << " popcount=" << pc << " pcll=" << pcll << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('gcd=12 lcm=36 popcount=4 pcll=3');
    });

    it('should support STL algorithms: lower_bound, upper_bound, accumulate, *min_element', () => {
      const code = `
        #include <iostream>
        #include <vector>
        #include <numeric>
        #include <algorithm>
        using namespace std;
        int main() {
          vector<int> v = {10, 20, 20, 30, 40};
          int lb_idx = lower_bound(v.begin(), v.end(), 20) - v.begin();
          int ub_idx = upper_bound(v.begin(), v.end(), 20) - v.begin();
          bool found = binary_search(v.begin(), v.end(), 30);
          int total = accumulate(v.begin(), v.end(), 0);
          int mn = *min_element(v.begin(), v.end());
          int mx = *max_element(v.begin(), v.end());

          cout << "lb=" << lb_idx << " ub=" << ub_idx << " found=" << found;
          cout << " sum=" << total << " min=" << mn << " max=" << mx << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('lb=1 ub=3 found=1 sum=120 min=10 max=40');
    });

    it('should support two-pointer loop with comma update: for (int i = 0, j = n - 1; i < j; i++, j--)', () => {
      const code = `
        #include <iostream>
        #include <vector>
        using namespace std;
        int main() {
          vector<int> v = {1, 2, 3, 4, 5};
          int n = 5;
          for (int i = 0, j = n - 1; i < j; i++, j--) {
            swap(v[i], v[j]);
          }
          cout << "reversed: " << v[0] << " " << v[1] << " " << v[2] << " " << v[3] << " " << v[4] << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('reversed: 5 4 3 2 1');
    });

    it('should support bitwise operators with correct precedence', () => {
      const code = `
        #include <iostream>
        using namespace std;
        int main() {
          int mask = 5; // 0101 in binary
          int bit0 = (mask & (1 << 0)) != 0;
          int bit1 = (mask & (1 << 1)) != 0;
          int bit2 = (mask & (1 << 2)) != 0;
          int xor_val = 5 ^ 3;
          int or_val = 4 | 2;
          cout << "b0=" << bit0 << " b1=" << bit1 << " b2=" << bit2 << " xor=" << xor_val << " or=" << or_val << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('b0=1 b1=0 b2=1 xor=6 or=6');
    });

    it('should support sort with greater<int>() comparator', () => {
      const code = `
        #include <iostream>
        #include <vector>
        #include <algorithm>
        using namespace std;
        int main() {
          vector<int> v = {3, 1, 4, 1, 5, 9};
          sort(v.begin(), v.end(), greater<int>());
          cout << "descending: " << v[0] << " " << v[1] << " " << v[2] << endl;
          return 0;
        }
      `;
      const res = runCppDPInterpreter(code);
      expect(res.error).toBeUndefined();
      expect(res.stdout).toContain('descending: 9 5 4');
    });
  });
});
