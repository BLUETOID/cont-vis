/**
 * C++ Lexer for DP Visualizer
 */

export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'STRING'
  | 'OPERATOR'
  | 'PUNCTUATION'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

const KEYWORDS = new Set([
  'int',
  'long',
  'short',
  'signed',
  'unsigned',
  'double',
  'float',
  'char',
  'bool',
  'void',
  'auto',
  'string',
  'vector',
  'pair',
  'map',
  'set',
  'multiset',
  'priority_queue',
  'deque',
  'queue',
  'stack',
  'if',
  'else',
  'for',
  'while',
  'return',
  'break',
  'continue',
  'struct',
  'const',
  'true',
  'false',
  'nullptr',
  'NULL',
  'cin',
  'cout',
  'endl',
  'max',
  'min',
  'swap',
  'memset',
  'sizeof',
]);

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  function peek(): string {
    return pos < source.length ? source[pos] : '';
  }

  function advance(): string {
    const ch = source[pos++];
    if (ch === '\n') {
      line++;
      col = 1;
    } else {
      col++;
    }
    return ch;
  }

  while (pos < source.length) {
    const ch = peek();

    // Skip whitespace
    if (/\s/.test(ch)) {
      advance();
      continue;
    }

    // Single-line comment
    if (ch === '/' && pos + 1 < source.length && source[pos + 1] === '/') {
      while (pos < source.length && peek() !== '\n') {
        advance();
      }
      continue;
    }

    // Multi-line comment
    if (ch === '/' && pos + 1 < source.length && source[pos + 1] === '*') {
      advance();
      advance();
      while (pos < source.length) {
        if (peek() === '*' && pos + 1 < source.length && source[pos + 1] === '/') {
          advance();
          advance();
          break;
        }
        advance();
      }
      continue;
    }

    // Preprocessor directive (#include, #define, using namespace std)
    if (ch === '#') {
      while (pos < source.length && peek() !== '\n') {
        advance();
      }
      continue;
    }

    const startLine = line;
    const startCol = col;

    // String literal
    if (ch === '"' || ch === "'") {
      const quote = advance();
      let str = '';
      while (pos < source.length && peek() !== quote) {
        if (peek() === '\\') {
          advance();
          const esc = advance();
          if (esc === 'n') str += '\n';
          else if (esc === 't') str += '\t';
          else str += esc;
        } else {
          str += advance();
        }
      }
      if (pos < source.length && peek() === quote) {
        advance(); // closing quote
      }
      tokens.push({ type: 'STRING', value: str, line: startLine, col: startCol });
      continue;
    }

    // Number literal (supports integers, decimals, scientific 1e9, and suffixes LL, ULL, etc.)
    if (/\d/.test(ch)) {
      let numStr = '';
      while (pos < source.length && /[\d.]/.test(peek())) {
        numStr += advance();
      }
      if (/[eE]/.test(peek())) {
        numStr += advance();
        if (peek() === '+' || peek() === '-') {
          numStr += advance();
        }
        while (pos < source.length && /\d/.test(peek())) {
          numStr += advance();
        }
      }
      // Consume integer suffixes: LL, ll, ULL, ull, L, l, U, u
      while (pos < source.length && /[uUlL]/.test(peek())) {
        advance();
      }
      tokens.push({ type: 'NUMBER', value: numStr, line: startLine, col: startCol });
      continue;
    }

    // Identifier or Keyword
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = '';
      while (pos < source.length && /[a-zA-Z0-9_]/.test(peek())) {
        ident += advance();
      }

      // Skip namespace qualifiers like std::
      if (ident === 'using' && peek() === ' ') {
        // skip `using namespace std;`
        while (pos < source.length && peek() !== ';') {
          advance();
        }
        if (peek() === ';') advance();
        continue;
      }
      if (ident === 'std' && peek() === ':' && pos + 1 < source.length && source[pos + 1] === ':') {
        advance();
        advance();
        continue;
      }

      const type: TokenType = KEYWORDS.has(ident) ? 'KEYWORD' : 'IDENTIFIER';
      tokens.push({ type, value: ident, line: startLine, col: startCol });
      continue;
    }

    // Multi-character operators
    const twoChars = source.slice(pos, pos + 2);
    if (
      [
        '==',
        '!=',
        '<=',
        '>=',
        '&&',
        '||',
        '++',
        '--',
        '+=',
        '-=',
        '*=',
        '/=',
        '%=',
        '<<',
        '>>',
        '->',
        '::',
      ].includes(twoChars)
    ) {
      advance();
      advance();
      tokens.push({ type: 'OPERATOR', value: twoChars, line: startLine, col: startCol });
      continue;
    }

    // Single-character operators
    if (['+', '-', '*', '/', '%', '<', '>', '=', '!', '&', '|', '^', '?', ':', '.', '~'].includes(ch)) {
      advance();
      tokens.push({ type: 'OPERATOR', value: ch, line: startLine, col: startCol });
      continue;
    }

    // Punctuation
    if (['(', ')', '{', '}', '[', ']', ';', ','].includes(ch)) {
      advance();
      tokens.push({ type: 'PUNCTUATION', value: ch, line: startLine, col: startCol });
      continue;
    }

    // Unrecognized character
    advance();
  }

  tokens.push({ type: 'EOF', value: '', line, col });
  return tokens;
}
