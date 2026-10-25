/**
 * Dynamic Programming Live Recurrence Formula Formatter
 */

export interface FormattedFormula {
  generalMath: string;
  pluggedValues: string;
  resultExpression: string;
}

export function formatFormulaForStep(
  patternId: string,
  row: number,
  col: number,
  currentVal: any,
  table: (number | string | null)[][],
  inputs: Record<string, any>
): FormattedFormula {
  if (patternId === 'knapsack_01') {
    const weights: number[] = inputs.weights || [2, 3, 4, 5];
    const values: number[] = inputs.values || [3, 4, 5, 8];
    const i = row;
    const w = col;

    if (i === 0 || w === 0) {
      return {
        generalMath: 'dp[i][w] = 0 (Base Case: No items or 0 capacity)',
        pluggedValues: `dp[${i}][${w}] = 0`,
        resultExpression: `0`,
      };
    }

    const wt = weights[i - 1];
    const val = values[i - 1];
    const skipVal = table[i - 1]?.[w] ?? 0;

    if (w < wt) {
      return {
        generalMath: 'dp[i][w] = dp[i-1][w]  (Item weight > capacity; must skip)',
        pluggedValues: `dp[${i}][${w}] = dp[${i - 1}][${w}] = ${skipVal}`,
        resultExpression: `${skipVal}`,
      };
    }

    const takeVal = (table[i - 1]?.[w - wt] ?? 0) as number;
    const totalTake = takeVal + val;

    return {
      generalMath: 'dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]])',
      pluggedValues: `dp[${i}][${w}] = max(${skipVal}, ${val} + ${takeVal}) = max(${skipVal}, ${totalTake})`,
      resultExpression: `${currentVal} (${Number(totalTake) > Number(skipVal) ? 'Chose Take' : 'Chose Skip'})`,
    };
  }

  if (patternId === 'lcs') {
    const s1: string = inputs.s1 || 'AGGTAB';
    const s2: string = inputs.s2 || 'GXTXAYB';
    const i = row;
    const j = col;

    if (i === 0 || j === 0) {
      return {
        generalMath: 'dp[i][j] = 0 (Base Case: Empty string prefix)',
        pluggedValues: `dp[${i}][${j}] = 0`,
        resultExpression: `0`,
      };
    }

    const c1 = s1[i - 1];
    const c2 = s2[j - 1];

    if (c1 === c2) {
      const diag = table[i - 1]?.[j - 1] ?? 0;
      return {
        generalMath: 'dp[i][j] = 1 + dp[i-1][j-1]  (Characters match: s1[i-1] == s2[j-1])',
        pluggedValues: `dp[${i}][${j}] = 1 + dp[${i - 1}][${j - 1}] = 1 + ${diag}`,
        resultExpression: `${currentVal} (Matched '${c1}')`,
      };
    }

    const top = table[i - 1]?.[j] ?? 0;
    const left = table[i]?.[j - 1] ?? 0;
    return {
      generalMath: 'dp[i][j] = max(dp[i-1][j], dp[i][j-1])  (Mismatch: skip from s1 or s2)',
      pluggedValues: `dp[${i}][${j}] = max(${top}, ${left})`,
      resultExpression: `${currentVal}`,
    };
  }

  if (patternId === 'coin_change') {
    const coins: number[] = inputs.coins || [1, 2, 5];
    const target = col;

    if (target === 0) {
      return {
        generalMath: 'dp[0] = 0 (Base Case: 0 coins needed for amount 0)',
        pluggedValues: 'dp[0] = 0',
        resultExpression: '0',
      };
    }

    const validTransitions = coins
      .filter((c) => target >= c)
      .map((c) => `1 + dp[${target - c}] (${1 + Number(table[0]?.[target - c] ?? 0)})`);

    return {
      generalMath: 'dp[i] = min(dp[i - coin] + 1) for coin in coins if i >= coin',
      pluggedValues: `dp[${target}] = min(${validTransitions.join(', ')})`,
      resultExpression: `${currentVal}`,
    };
  }

  // Fallback generic format
  return {
    generalMath: `dp[${row}][${col}] = f(previous_states)`,
    pluggedValues: `Evaluating cell (${row}, ${col})`,
    resultExpression: `${currentVal ?? 'computing...'}`,
  };
}
