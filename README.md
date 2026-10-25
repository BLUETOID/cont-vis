# cont-vis ⚡

> **High-Performance In-Browser C++ Container & Dynamic Programming Visualizer**  
> Write real C++ competitive programming code and visualize vectors, 2D matrices, priority queues (min/max heaps), deques, stacks, sets, and recursion trees in real-time with time-travel execution.

[![React](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Tests-46%20Passed-22c55e?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

**cont-vis** is an interactive, zero-overhead visualization engine designed for algorithm enthusiasts, competitive programmers, and computer science students.

Unlike typical visualizers that rely on canned animations or hardcoded presets, **cont-vis runs an embedded C++ interpreter right inside your browser**. You write or paste standard C++ code, and the engine automatically sniffs variables in scope, binds them to interactive data structure panels, records step-by-step dependency graphs, and lets you scrub forwards and backwards through time.

Designed with a **pure performance aesthetic**—no laggy blur filters, glow shadows, or superfluous decorations—ensuring high frame rates even when rendering large matrices and complex heaps.

---

## 🚀 Key Features

- **Code-Driven Data Structures**:
  - **1D Vectors & Arrays**: `vector<int>`, fixed-size `int arr[N]`, `.assign()`, `.resize()`, `.push_back()`, `.emplace_back()`.
  - **2D Matrices & DP Tables**: `vector<vector<int>>`, `int dp[N][M]`, row/column highlights, and read/write dependency arrows.
  - **Priority Queues (Heaps)**: Max-heap default `priority_queue<int>` and Min-heap `priority_queue<int, vector<int>, greater<int>>`.
  - **Deques & Queues**: Double-ended queue (`push_front`, `push_back`, `pop_front`, `pop_back`, `dq[i]`) and FIFO queues.
  - **Stacks**: LIFO stack visualization with `.push()`, `.pop()`, `.top()`.
  - **Sets & Multisets**: Ordered sets and multisets with `.insert()`, `.count()`, `.erase()`, `.size()`.
  - **Hash Maps**: `unordered_map<string, int>` and `map<int, int>` with key-value tracking.
  - **Pairs & Structured Bindings**: `pair<int, int> p = {u, v};`, `tie(a, b) = p;`, and C++17 `auto [u, v] = p;`.
- **Dedicated Recursion Call Tree**:
  - Automatically activates when recursive function calls are detected.
  - Displays call stack frames, parameter states, return values, and memoized hit branches.
- **Time-Travel Debugging & Execution Scrubber**:
  - Step forward, step backward, or jump to any execution step on the timeline.
  - Variable playback speeds: `0.25x`, `0.5x`, `1x`, `2x`, `4x`, `8x`.
- **Step-Synchronized Terminal Output**:
  - `cout <<` prints are synchronized with the timeline rather than outputting all at once.
- **Interactive Custom Input (`cin >>`)**:
  - Input tab is conditionally highlighted only when your C++ code requests standard input.
  - Live feedback shows which variable consumed which input token.

---

## 🧠 Full Competitive Programming (CP) Support

`cont-vis` includes a C++ interpreter and preprocessor tailored for real-world competitive programming syntax:

### 1. `long long` & 64-Bit Integer Math
- Multi-word types: `long long`, `unsigned long long`, `signed int`, `short int`, `long double`, `int64_t`, `uint64_t`, `ll`, `ull`.
- Numeric suffixes: `1LL`, `2ll`, `1ULL`, `0LL`, `1u`, `1L`.
- Scientific notation: `1e9`, `1e18`, `2e5`.
- **BigInt 64-bit Precision**: Arithmetic operations (`*`, `%`, `+`, `-`, `/`) preserve 64-bit precision without JavaScript float rounding errors. Modulo arithmetic like `(1000000000LL * 2000000000LL) % 1000000007LL` outputs the exact result (`98`).

### 2. Boilerplate & Macros
- **`#define int long long`**: Works seamlessly with `signed main()` and `int32_t main()`.
- **Header Stripping**: Safely processes `#include <bits/stdc++.h>` and all standard library headers.
- **CP Macros**:
  - `#define all(x) (x).begin(), (x).end()`
  - `#define sz(x) (int)(x).size()`
  - `#define pb push_back`
  - `#define eb emplace_back`
  - `#define mp make_pair`
  - `#define fi first`, `#define se second`
  - Function macros: `#define rep(i, a, b) for(int i = a; i < b; ++i)`
  - Macro expansion is isolated outside string and char literals (`""`, `''`).

### 3. STL Algorithms & CP Built-ins
- **Binary Search**:
  - `lower_bound(all(v), x) - v.begin()` (with iterator pointer subtraction)
  - `upper_bound(all(v), x) - v.begin()`
  - `binary_search(all(v), x)`
- **Sorting & Permutations**:
  - `sort(all(v))`
  - `sort(all(v), greater<int>())`
  - `sort(v.rbegin(), v.rend())`
  - `reverse(all(v))`
  - `next_permutation(all(v))`
  - `fill(all(v), val)`
- **Min/Max & Reductions**:
  - `*min_element(all(v))` and `*max_element(all(v))`
  - `accumulate(all(v), 0LL)`
  - Multi-arg: `min({a, b, c})`, `max({a, b, c})`
- **Memory & Bitwise**:
  - `memset(dp, -1, sizeof(dp))` for 1D and 2D arrays
  - `__gcd(a, b)`, `lcm(a, b)`
  - `__builtin_popcount(x)`, `__builtin_popcountll(x)`
  - `__builtin_clz(x)`, `__builtin_ctz(x)`
  - Bitwise operations: `&`, `|`, `^`, `~`, `<<`, `>>` with standard operator precedence.
- **Fast I/O**:
  - `ios_base::sync_with_stdio(false); cin.tie(NULL); cout.tie(0);`

---

## 📦 Project Structure

```
cont-vis/
├── src/
│   ├── components/
│   │   ├── canvas/             # High-speed Canvas viewports & data structure renderers
│   │   ├── common/             # Header, Navigation, and Playback Controls
│   │   ├── editor/             # Monaco Code Editor wrapper with theme integration
│   │   └── panels/             # Step Terminal Console, Custom Input, Inspector
│   ├── core/
│   │   ├── dp/                 # Solution backtracker & dependency extractors
│   │   └── interpreter/        # Custom In-Browser C++ Engine:
│   │       ├── preprocessor.ts # Macro expansion & CP header normalization
│   │       ├── lexer.ts        # Tokenizer supporting numeric suffixes & C++20 keywords
│   │       ├── parser.ts       # AST parser (structured bindings, C-style casts)
│   │       ├── evaluator.ts    # Runtime execution engine & container sniffer
│   │       └── ast.ts          # Strongly typed AST definitions
│   ├── presets/                # Classic DP templates & CP Boilerplate presets
│   ├── types/                  # Global TypeScript type definitions
│   ├── App.tsx                 # Root layout & synchronization orchestrator
│   └── main.tsx                # Entry point
├── tests/                      # Comprehensive Vitest test suites (46 tests)
│   ├── cpp_features.test.ts    # CP features, long long, macros, and STL algorithms
│   ├── data_structures.test.ts # Vectors, 2D arrays, stacks, queues, and maps
│   ├── dp_patterns.test.ts     # Knapsack, LCS, LIS, Interval DP, Tree DP
│   └── interpreter.test.ts     # Core interpreter semantics
└── package.json
```

---

## 💻 Local Development

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/BLUETOID/cont-vis.git
cd cont-vis
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Test Suite
```bash
npm test
```
Runs 46 unit and integration tests covering the interpreter, DP patterns, STL algorithms, and CP idioms.

### 5. Build for Production
```bash
npm run build
```
Compiles TypeScript (`tsc -b`) and generates production assets via Vite in `dist/`.

---

## 🚢 Deploying to Vercel

`cont-vis` is built as a zero-backend, pure client-side Single Page Application (SPA), making it natively compatible with Vercel with zero extra configuration.

### Option A: Via GitHub Integration (Recommended)
1. Push your repository to GitHub (see [Git Instructions](#-pushing-to-github)).
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import `BLUETOID/cont-vis`.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**. Your visualizer will be live with automatic CI/CD on every push to `main`!

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts in your terminal. For production deployment:
```bash
vercel --prod
```

---

## 📤 Pushing to GitHub

To push this repository to GitHub under `https://github.com/BLUETOID/cont-vis.git`, run:

```bash
git init
git add .
git commit -m "feat: initial commit for cont-vis - C++ container & DP visualizer"
git remote add origin https://github.com/BLUETOID/cont-vis.git
git branch -M main
git push -u origin main
```

*(If you already initialized git, simply add the remote and push!)*

---

## 🤝 Contributing

Contributions, feature suggestions, and bug reports are warmly welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

**Crafted with ⚡ by [BLUETOID](https://github.com/BLUETOID)**
