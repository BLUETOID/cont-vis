# cont-vis

An in-browser C++ container and dynamic programming visualizer.

cont-vis executes C++ competitive programming code using an embedded client-side interpreter and provides real-time visualization of data structures, execution timelines, standard input/output, and recursive call trees.

---

## Overview

Unlike visualizers that rely on static pre-rendered animations, cont-vis runs a custom lexical analyzer, recursive descent parser, and runtime evaluator directly in the browser. It inspects variables declared within execution scope, traces state changes after each statement, and renders interactive representations of vectors, matrices, stacks, queues, and recursion trees.

The user interface is designed with a dark, low-latency theme focused on performance and readability without unnecessary visual effects.

---

## Features

- **Embedded C++ Execution Engine**
  - In-browser preprocessor, lexer, abstract syntax tree (AST) parser, and evaluator.
  - Zero server dependency: code parsing and runtime tracing execute entirely client-side.

- **Data Structure Visualizations**
  - **1D Vectors and Arrays**: Dynamic size tracking, pointer overlays, and read/write highlighting (`vector<int>`, fixed-size arrays).
  - **2D Matrices and Grids**: Cell coordinates, row/column index labels, and matrix manipulation (`vector<vector<int>>`, multidimensional arrays).
  - **Stacks and Queues**: LIFO and FIFO sequence tracking with boundary indicators (`stack<int>`, `queue<int>`).
  - **Hash Maps and Sets**: Key-value pair monitoring (`unordered_map`, `map`).
  - **Pairs and Tuples**: Structured bindings and tuple decomposition.

- **Dynamic Programming and Recursion Analysis**
  - **Recursion Call Tree**: Graph of function invocations, parameter bindings, return states, and memoization hit branches.
  - **DP Table Inspector**: Cell-by-cell state transitions with dependency tracing.

- **Execution and Debugger Controls**
  - **Timeline Scrubber**: Step forward, step backward, or jump to any execution step.
  - **Playback Speed Control**: Configurable stepping speed from 0.5x to 4.0x.
  - **Step-Synchronized Terminal**: Standard output (`cout`) updates synchronously with the active step index.
  - **Conditional Input Handling**: Input panel activates when standard input (`cin`) is present in the code.
  - **Adjustable Splitter**: Resizable divider between the code editor and visualization canvas.

---

## Competitive Programming Syntax Support

The embedded interpreter is designed to handle standard competitive programming paradigms:

### 1. Integer Types and 64-Bit Arithmetic
- Supported types: `int`, `long long`, `unsigned long long`, `int64_t`, `uint64_t`, `size_t`.
- Numeric literals: integer suffixes (`1LL`, `2ll`, `1ULL`, `1u`) and scientific notation (`1e9`, `1e18`).
- Precision: 64-bit operations are handled without floating-point truncation.

### 2. Macros and Preprocessing
- `#define int long long` with `signed main()` and `int32_t main()`.
- `#include <bits/stdc++.h>` header normalization.
- Common competitive programming macros:
  - `#define all(x) (x).begin(), (x).end()`
  - `#define sz(x) (int)(x).size()`
  - `#define pb push_back`
  - `#define eb emplace_back`
  - `#define mp make_pair`
  - `#define fi first`, `#define se second`
  - Parameterized loop macros such as `#define rep(i, a, b) for(int i = a; i < b; ++i)`.

### 3. Standard Library Functions
- **Binary Search**: `lower_bound`, `upper_bound`, `binary_search`.
- **Algorithms**: `sort`, `reverse`, `next_permutation`, `fill`, `min_element`, `max_element`, `accumulate`.
- **Utility Functions**: `min({a, b, c})`, `max({a, b, c})`, `memset`, `__gcd`, `lcm`.
- **Bit Operations**: `__builtin_popcount`, `__builtin_popcountll`, `__builtin_clz`, `__builtin_ctz`, bitwise shifts, and masks.
- **I/O Synchronization**: `ios_base::sync_with_stdio(false); cin.tie(NULL);`.

---

## Architecture and Project Structure

```
cont-vis/
├── src/
│   ├── components/
│   │   ├── canvas/             # Visualization widgets (arrays, matrices, trees, stacks)
│   │   ├── common/             # Header, controls, navigation
│   │   ├── editor/             # Monaco code editor integration
│   │   └── panels/             # Input panel, terminal console, call stack inspector
│   ├── core/
│   │   ├── dp/                 # Recursion tree layout, formula parsers, backtracker
│   │   └── interpreter/        # Preprocessor, lexer, parser, AST, and evaluator
│   ├── presets/                # Algorithm templates and competitive programming snippets
│   ├── types/                  # TypeScript interface declarations
│   ├── App.tsx                 # Application state and workspace orchestration
│   ├── index.css               # Design tokens and theme styling
│   └── main.tsx                # Client application root
├── tests/                      # Automated Vitest test suite
│   ├── cpp_features.test.ts    # Syntax, macro, and algorithm compliance tests
│   ├── data_structures.test.ts # Container state tracking tests
│   ├── dp_patterns.test.ts     # DP pattern tests (Knapsack, LIS, LCS)
│   └── interpreter.test.ts     # Core evaluator semantics
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm or pnpm

### Installation

Clone the repository and install project dependencies:

```bash
git clone https://github.com/BLUETOID/cont-vis.git
cd cont-vis
npm install
```

### Running Locally

Start the local Vite development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Running Tests

Execute the automated test suite with Vitest:

```bash
npm test
```

### Production Build

Create an optimized client bundle:

```bash
npm run build
```

Built assets will be emitted to the `dist/` directory.

---

## Deployment

The application is completely static and requires no server-side execution runtime.

### Vercel Deployment

1. Connect the repository to your Vercel account.
2. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Trigger a deployment.

Alternatively, deploy using the Vercel CLI:

```bash
npm install -g vercel
vercel --prod
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
