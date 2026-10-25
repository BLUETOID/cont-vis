import { describe, it, expect } from 'vitest';
import { runCppDPInterpreter } from '../src/core/interpreter';

describe('Data Structure Visualizer Snapshot Engine', () => {
  it('captures 1D array state, values, and updates', () => {
    const code = `
      int main() {
        vector<int> nums = {10, 20, 30};
        nums[1] = 99;
        return nums[1];
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.finalAnswer).toBe(99);

    const lastStep = res.trace[res.trace.length - 1];
    expect(lastStep.arrays).toBeDefined();
    expect(lastStep.arrays?.['nums']).toBeDefined();
    expect(lastStep.arrays?.['nums'].values).toEqual([10, 99, 30]);
  });

  it('captures 2D matrix state with rows, cols, and cell values', () => {
    const code = `
      int main() {
        vector<vector<int>> matrix(3, vector<int>(3, 0));
        matrix[1][2] = 42;
        return matrix[1][2];
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.finalAnswer).toBe(42);

    const lastStep = res.trace[res.trace.length - 1];
    expect(lastStep.matrices).toBeDefined();
    expect(lastStep.matrices?.['matrix']).toBeDefined();
    expect(lastStep.matrices?.['matrix'].rows).toBe(3);
    expect(lastStep.matrices?.['matrix'].cols).toBe(3);
    expect(lastStep.matrices?.['matrix'].values[1][2]).toBe(42);
  });

  it('captures stack push, pop, and top actions', () => {
    const code = `
      int main() {
        stack<int> st;
        st.push(5);
        st.push(15);
        st.pop();
        st.push(25);
        return st.top();
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.finalAnswer).toBe(25);

    const lastStep = res.trace[res.trace.length - 1];
    expect(lastStep.stacks).toBeDefined();
    expect(lastStep.stacks?.['st']).toBeDefined();
    expect(lastStep.stacks?.['st'].items).toEqual([5, 25]);
    expect(lastStep.stacks?.['st'].topIndex).toBe(1);
  });

  it('captures queue push, pop, and front actions', () => {
    const code = `
      int main() {
        queue<int> q;
        q.push(100);
        q.push(200);
        q.pop();
        return q.front();
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.finalAnswer).toBe(200);

    const lastStep = res.trace[res.trace.length - 1];
    expect(lastStep.queues).toBeDefined();
    expect(lastStep.queues?.['q']).toBeDefined();
    expect(lastStep.queues?.['q'].items).toEqual([200]);
  });

  it('captures map and unordered_map key-value entries', () => {
    const code = `
      int main() {
        unordered_map<int, int> mp;
        mp[7] = 77;
        mp[9] = 99;
        return mp[7];
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.finalAnswer).toBe(77);

    const lastStep = res.trace[res.trace.length - 1];
    expect(lastStep.maps).toBeDefined();
    expect(lastStep.maps?.['mp']).toBeDefined();
    expect(lastStep.maps?.['mp'].entries).toEqual([
      [7, 77],
      [9, 99],
    ]);
  });

  it('captures pointer badges (i, j) and scalar variables (ans, sum)', () => {
    const code = `
      int main() {
        vector<int> arr = {1, 2, 3, 4};
        int sum = 0;
        for (int i = 0; i < 4; i++) {
          sum += arr[i];
        }
        return sum;
      }
    `;
    const res = runCppDPInterpreter(code);
    expect(res.error).toBeUndefined();
    expect(res.finalAnswer).toBe(10);

    const stepWithPointer = res.trace.find((s) => s.pointers && s.pointers['i'] !== undefined);
    expect(stepWithPointer).toBeDefined();
    expect(typeof stepWithPointer?.pointers?.['i'].value).toBe('number');

    const lastStep = res.trace[res.trace.length - 1];
    expect(lastStep.scalars?.['sum']).toBe(10);
  });

  it('reads input via cin >> from custom stdin', () => {
    const code = `
      int main() {
        int n;
        cin >> n;
        vector<int> arr(n, 0);
        for (int i = 0; i < n; i++) {
          cin >> arr[i];
        }
        return arr[2];
      }
    `;
    const res = runCppDPInterpreter(code, { stdin: '3 100 200 300' });
    expect(res.error).toBeUndefined();
    expect(res.finalAnswer).toBe(300);

    const lastStep = res.trace[res.trace.length - 1];
    expect(lastStep.arrays?.['arr'].values).toEqual([100, 200, 300]);
  });
});
