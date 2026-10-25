/**
 * C++ Preprocessor for Competitive Programming & Modern C++
 * Handles:
 * - #include (e.g. <bits/stdc++.h>, <iostream>)
 * - #define macros (object-like and function-like, e.g. #define int long long, pb, fi, se, all(x), sz(x), rep(i, a, b))
 * - typedef declarations (e.g. typedef long long ll; typedef pair<int, int> pii;)
 * - using type alias declarations (e.g. using ll = long long; using pii = pair<int, int>;)
 * - using namespace std;
 * - signed main() / int32_t main() idiom when #define int long long is active
 */

function replaceOutsideStrings(
  code: string,
  regex: RegExp,
  replacement: string | ((...args: any[]) => string)
): string {
  // Split by string literals to prevent replacing inside strings
  const stringRegex = /("(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/g;
  const parts = code.split(stringRegex);

  for (let i = 0; i < parts.length; i += 2) {
    // Even indices are code outside of string literals
    parts[i] = (parts[i] as any).replaceAll(regex, replacement as any);
  }

  return parts.join('');
}

export function preprocessCpp(source: string): string {
  let lines = source.split('\n');
  const objectMacros = new Map<string, string>();
  const functionMacros: { name: string; params: string[]; body: string }[] = [];
  const typeAliases = new Map<string, string>();
  let hasDefineIntLongLong = false;

  // Pre-seed common CP typedefs / aliases that are standard in competitive programming
  typeAliases.set('ll', 'long long');
  typeAliases.set('ull', 'unsigned long long');
  typeAliases.set('pii', 'pair<int, int>');
  typeAliases.set('pll', 'pair<long long, long long>');
  typeAliases.set('vi', 'vector<int>');
  typeAliases.set('vll', 'vector<long long>');
  typeAliases.set('vpii', 'vector<pair<int, int>>');

  const processedLines: string[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const trimmed = rawLine.trim();

    // 1. #include directive (including #include <bits/stdc++.h>)
    if (trimmed.startsWith('#include')) {
      processedLines.push('');
      continue;
    }

    // 2. #define directives
    if (trimmed.startsWith('#define')) {
      const rest = trimmed.slice(7).trim();

      // Check special case: #define int long long
      if (/^int\s+long\s+long\s*$/.test(rest)) {
        hasDefineIntLongLong = true;
        processedLines.push('');
        continue;
      }

      // Check function-like macro: #define all(x) (x).begin(), (x).end()
      const fnMacroMatch = rest.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s+(.*)$/);
      if (fnMacroMatch) {
        const name = fnMacroMatch[1];
        const params = fnMacroMatch[2].split(',').map((p) => p.trim()).filter(Boolean);
        const body = fnMacroMatch[3].trim();
        functionMacros.push({ name, params, body });
        processedLines.push('');
        continue;
      }

      // Object-like macro: #define NAME REPLACEMENT
      const objMacroMatch = rest.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s+(.*)$/);
      if (objMacroMatch) {
        const name = objMacroMatch[1];
        const replacement = objMacroMatch[2].trim();
        objectMacros.set(name, replacement);
        processedLines.push('');
        continue;
      }

      processedLines.push('');
      continue;
    }

    // 3. typedef declarations: typedef long long ll; or typedef pair<int, int> pii;
    const typedefMatch = trimmed.match(/^typedef\s+(.+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*;\s*$/);
    if (typedefMatch) {
      const targetType = typedefMatch[1].trim();
      const alias = typedefMatch[2].trim();
      typeAliases.set(alias, targetType);
      processedLines.push('');
      continue;
    }

    // 4. using alias declarations: using ll = long long; or using pii = pair<int, int>;
    const usingAliasMatch = trimmed.match(/^using\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)\s*;\s*$/);
    if (usingAliasMatch) {
      const alias = usingAliasMatch[1].trim();
      const targetType = usingAliasMatch[2].trim();
      typeAliases.set(alias, targetType);
      processedLines.push('');
      continue;
    }

    // 5. using namespace std;
    if (/^using\s+namespace\s+std\s*;\s*$/.test(trimmed)) {
      processedLines.push('');
      continue;
    }

    processedLines.push(rawLine);
  }

  let code = processedLines.join('\n');

  // Handle #define int long long
  if (hasDefineIntLongLong) {
    // If the code uses signed main() or int32_t main(), normalize it to int main()
    code = replaceOutsideStrings(code, /\b(signed|int32_t)\s+main\s*\(/g, 'int main(');

    // Replace all other 'int' with 'long long' except 'int main('
    code = replaceOutsideStrings(code, /\bint\b(?!\s*main\s*\()/g, 'long long');
  }

  // Common CP function macros
  // 1. all(x) -> (x).begin(), (x).end() or x.begin(), x.end()
  code = replaceOutsideStrings(code, /\ball\s*\(\s*([^()]+)\s*\)/g, '($1).begin(), ($1).end()');

  // 2. sz(x) -> (int)((x).size())
  code = replaceOutsideStrings(code, /\bsz\s*\(\s*([^()]+)\s*\)/g, '(int)(($1).size())');

  // Apply custom function macros
  for (const fn of functionMacros) {
    if (fn.name === 'all' || fn.name === 'sz') continue; // already handled
    const regex = new RegExp(`\\b${fn.name}\\s*\\(([^)]*)\\)`, 'g');
    code = replaceOutsideStrings(code, regex, (_fullMatch: string, argsStr: string) => {
      const args = argsStr.split(',').map((a) => a.trim());
      let body = fn.body;
      for (let i = 0; i < fn.params.length; i++) {
        const param = fn.params[i];
        const arg = args[i] || '';
        body = body.replace(new RegExp(`\\b${param}\\b`, 'g'), arg);
      }
      return body;
    });
  }

  // Apply object macros (e.g. pb -> push_back, fi -> first, se -> second, INF -> 1e18)
  for (const [name, replacement] of objectMacros.entries()) {
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    code = replaceOutsideStrings(code, regex, replacement);
  }

  // Apply typedefs & using aliases (e.g. ll -> long long, pii -> pair<int, int>)
  for (const [alias, targetType] of typeAliases.entries()) {
    const regex = new RegExp(`\\b${alias}\\b`, 'g');
    code = replaceOutsideStrings(code, regex, targetType);
  }

  return code;
}
