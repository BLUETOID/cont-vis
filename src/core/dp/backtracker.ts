/**
 * Dynamic Programming Solution Backtracker & Path Reconstructor
 */

import type { DPPosition, BacktrackStep } from '../../types/dp';

export interface BacktrackResult {
  path: DPPosition[];
  steps: BacktrackStep[];
  solutionSummary: string;
}

export function reconstructBacktrackPath(
  patternId: string,
  table: (number | string | null)[][],
  inputs: Record<string, any>
): BacktrackResult {
  const path: DPPosition[] = [];
  const steps: BacktrackStep[] = [];

  if (!table || table.length === 0 || !table[0]) {
    return { path: [], steps: [], solutionSummary: 'No table data available.' };
  }

  const rows = table.length;
  const cols = table[0].length;

  if (patternId === 'knapsack_01' || patternId === 'subset_sum') {
    const weights: number[] = inputs.weights || [2, 3, 4, 5];
    const values: number[] = inputs.values || [3, 4, 5, 8];
    const capacity: number = inputs.capacity || 5;

    let r = weights.length;
    let c = capacity;
    const chosenItems: string[] = [];

    while (r > 0 && c >= 0) {
      path.push({ row: r, col: c });
      const currentVal = Number(table[r]?.[c] ?? 0);
      const aboveVal = Number(table[r - 1]?.[c] ?? 0);
      const wt = weights[r - 1];
      const val = values[r - 1];

      if (currentVal !== aboveVal && c >= wt) {
        chosenItems.push(`Item ${r} (weight: ${wt}, value: ${val})`);
        steps.push({
          currentCell: { row: r, col: c },
          decisionExplanation: `Selected Item ${r} because dp[${r}][${c}] (${currentVal}) != dp[${r - 1}][${c}] (${aboveVal}). Remainder capacity: ${c - wt}`,
          solutionItems: [...chosenItems],
          runningMetric: `Value: ${currentVal}`,
        });
        c -= wt;
      } else {
        steps.push({
          currentCell: { row: r, col: c },
          decisionExplanation: `Skipped Item ${r} because dp[${r}][${c}] (${currentVal}) == dp[${r - 1}][${c}] (${aboveVal}).`,
          solutionItems: [...chosenItems],
          runningMetric: `Value: ${currentVal}`,
        });
      }
      r--;
    }
    path.push({ row: 0, col: c });

    return {
      path,
      steps,
      solutionSummary: `Optimal Value: ${table[weights.length]?.[capacity] ?? 0} with items: [${chosenItems.join(', ')}]`,
    };
  }

  if (patternId === 'lcs') {
    const s1: string = inputs.s1 || 'AGGTAB';
    const s2: string = inputs.s2 || 'GXTXAYB';
    let i = s1.length;
    let j = s2.length;
    const lcsChars: string[] = [];

    while (i > 0 && j > 0) {
      path.push({ row: i, col: j });
      if (s1[i - 1] === s2[j - 1]) {
        lcsChars.unshift(s1[i - 1]);
        steps.push({
          currentCell: { row: i, col: j },
          decisionExplanation: `Match '${s1[i - 1]}' == '${s2[j - 1]}'! Added to LCS. Stepping diagonally to dp[${i - 1}][${j - 1}].`,
          solutionItems: [...lcsChars],
          runningMetric: `Length: ${lcsChars.length}`,
        });
        i--;
        j--;
      } else {
        const topVal = Number(table[i - 1]?.[j] ?? 0);
        const leftVal = Number(table[i]?.[j - 1] ?? 0);
        if (topVal >= leftVal) {
          steps.push({
            currentCell: { row: i, col: j },
            decisionExplanation: `'${s1[i - 1]}' != '${s2[j - 1]}'. Moving UP to dp[${i - 1}][${j}] (${topVal} >= ${leftVal}).`,
            solutionItems: [...lcsChars],
          });
          i--;
        } else {
          steps.push({
            currentCell: { row: i, col: j },
            decisionExplanation: `'${s1[i - 1]}' != '${s2[j - 1]}'. Moving LEFT to dp[${i}][${j - 1}] (${leftVal} > ${topVal}).`,
            solutionItems: [...lcsChars],
          });
          j--;
        }
      }
    }
    path.push({ row: i, col: j });

    return {
      path,
      steps,
      solutionSummary: `Longest Common Subsequence: "${lcsChars.join('')}" (Length: ${lcsChars.length})`,
    };
  }

  if (patternId === 'grid_paths' || patternId === 'min_cost_path') {
    let r = rows - 1;
    let c = cols - 1;
    const coords: string[] = [];

    while (r > 0 || c > 0) {
      path.push({ row: r, col: c });
      coords.unshift(`(${r}, ${c})`);

      if (r === 0) {
        c--;
      } else if (c === 0) {
        r--;
      } else {
        const top = Number(table[r - 1]?.[c] ?? Infinity);
        const left = Number(table[r]?.[c - 1] ?? Infinity);
        if (top <= left) {
          r--;
        } else {
          c--;
        }
      }
    }
    path.push({ row: 0, col: 0 });
    coords.unshift('(0, 0)');

    return {
      path,
      steps,
      solutionSummary: `Optimal Path Traversal: ${coords.join(' -> ')}`,
    };
  }

  if (patternId === 'coin_change') {
    const coins: number[] = inputs.coins || [1, 2, 5];
    const amount: number = inputs.amount || 11;
    let curr = amount;
    const pickedCoins: number[] = [];

    while (curr > 0) {
      path.push({ row: 0, col: curr });
      let matchedCoin: number | null = null;
      for (const coin of coins) {
        if (curr >= coin) {
          const currentVal = Number(table[0]?.[curr] ?? 0);
          const prevVal = Number(table[0]?.[curr - coin] ?? 0);
          if (currentVal === prevVal + 1) {
            matchedCoin = coin;
            break;
          }
        }
      }

      if (matchedCoin !== null) {
        pickedCoins.push(matchedCoin);
        steps.push({
          currentCell: { row: 0, col: curr },
          decisionExplanation: `Used coin ${matchedCoin}: dp[${curr}] = 1 + dp[${curr - matchedCoin}]`,
          solutionItems: pickedCoins.map((c) => `Coin ${c}`),
        });
        curr -= matchedCoin;
      } else {
        break;
      }
    }
    path.push({ row: 0, col: 0 });

    return {
      path,
      steps,
      solutionSummary: `Optimal Coins Used: [${pickedCoins.join(', ')}] (Total: ${pickedCoins.length} coins)`,
    };
  }

  // Fallback: general diagonal or cell path
  let r = rows - 1;
  let c = cols - 1;
  path.push({ row: r, col: c });

  return {
    path,
    steps,
    solutionSummary: `Optimal final result at cell (${r}, ${c}): ${table[r]?.[c] ?? 'N/A'}`,
  };
}
