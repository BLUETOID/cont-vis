/**
 * Recursive Descent C++ Parser for DP Visualizer
 */

import type { Token, TokenType } from './lexer';
import type {
  BaseASTNode,
  ProgramNode,
  FunctionDeclNode,
  BlockStatementNode,
  VariableDeclNode,
  VariableDeclarator,
  IfStatementNode,
  WhileStatementNode,
  ForStatementNode,
  RangeForStatementNode,
  ReturnStatementNode,
  BreakStatementNode,
  ContinueStatementNode,
  ExpressionStatementNode,
  AssignmentStatementNode,
  CompoundAssignmentStatementNode,
  IndexAssignmentStatementNode,
  MemberAssignmentStatementNode,
  TieAssignmentStatementNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  UpdateExpressionNode,
  CallExpressionNode,
  MemberCallExpressionNode,
  MemberAccessExpressionNode,
  IndexAccessExpressionNode,
  ConditionalExpressionNode,
  TypeCastExpressionNode,
  SequenceExpressionNode,
  IdentifierNode,
  LiteralNode,
  ArrayLiteralNode,
  EmptyStatementNode,
} from './ast';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: '', line: 0, col: 0 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private check(type: TokenType, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (token.type !== type) return false;
    if (value !== undefined && value !== '' && token.value !== value) return false;
    return true;
  }

  private match(type: TokenType, ...values: string[]): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (token.type !== type) return false;
    if (values.length === 0) {
      this.advance();
      return true;
    }
    for (const val of values) {
      if (token.value === val) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, value: string, message: string): Token {
    if (this.check(type, value)) return this.advance();
    const token = this.peek();
    throw new Error(`Parse error at line ${token.line}: ${message}. Found '${token.value}'`);
  }

  public parseProgram(): ProgramNode {
    const body: BaseASTNode[] = [];
    const startLine = this.peek().line;

    while (!this.isAtEnd()) {
      const decl = this.parseTopLevelDeclaration();
      if (decl) {
        body.push(decl);
      }
    }

    return {
      type: 'Program',
      line: startLine,
      body,
    };
  }

  private parseTopLevelDeclaration(): BaseASTNode | null {
    // Semicolon
    if (this.match('PUNCTUATION', ';')) {
      return null;
    }

    // Function or Global Variable
    const typeStr = this.parseType();
    if (!typeStr) {
      // Expression statement or other construct
      return this.parseStatement();
    }

    const nameToken = this.consume('IDENTIFIER', '', 'Expected name after type');
    const name = nameToken.value;

    let isFunction = false;
    if (this.check('PUNCTUATION', '(')) {
      // Lookahead to matching ')'
      let depth = 0;
      for (let i = this.current; i < this.tokens.length; i++) {
        if (this.tokens[i].value === '(') depth++;
        else if (this.tokens[i].value === ')') {
          depth--;
          if (depth === 0) {
            if (this.tokens[i + 1]?.value === '{') {
              isFunction = true;
            }
            break;
          }
        }
      }
    }

    if (isFunction) {
      return this.parseFunctionDeclaration(typeStr, name, nameToken.line);
    }

    // Otherwise it's a global variable declaration
    return this.parseVariableDeclarationRest(typeStr, name, nameToken.line);
  }

  private parseType(): string | null {
    while (this.match('KEYWORD', 'const')) {}

    const token = this.peek();
    if (!token) return null;

    // Check multi-word types starting with 'long' (e.g. long long, long long int, long int, long double)
    if (token.value === 'long') {
      this.advance();
      let typeName = 'long';
      if (this.peek().value === 'long') {
        this.advance();
        typeName = 'long long';
        if (this.peek().value === 'int') {
          this.advance();
          typeName = 'long long int';
        }
      } else if (this.peek().value === 'int') {
        this.advance();
        typeName = 'long int';
      } else if (this.peek().value === 'double') {
        this.advance();
        typeName = 'long double';
      }
      return this.parseTypeSuffix(typeName);
    }

    // Check multi-word types starting with 'unsigned'
    if (token.value === 'unsigned') {
      this.advance();
      let typeName = 'unsigned';
      if (this.peek().value === 'long') {
        this.advance();
        typeName = 'unsigned long';
        if (this.peek().value === 'long') {
          this.advance();
          typeName = 'unsigned long long';
          if (this.peek().value === 'int') {
            this.advance();
            typeName = 'unsigned long long int';
          }
        } else if (this.peek().value === 'int') {
          this.advance();
          typeName = 'unsigned long int';
        }
      } else if (this.peek().value === 'int') {
        this.advance();
        typeName = 'unsigned int';
      } else if (this.peek().value === 'short') {
        this.advance();
        typeName = 'unsigned short';
      } else if (this.peek().value === 'char') {
        this.advance();
        typeName = 'unsigned char';
      }
      return this.parseTypeSuffix(typeName);
    }

    // Check multi-word types starting with 'signed'
    if (token.value === 'signed') {
      this.advance();
      let typeName = 'signed';
      if (this.peek().value === 'int') {
        this.advance();
        typeName = 'signed int';
      } else if (this.peek().value === 'char') {
        this.advance();
        typeName = 'signed char';
      }
      return this.parseTypeSuffix(typeName);
    }

    // Check multi-word types starting with 'short'
    if (token.value === 'short') {
      this.advance();
      let typeName = 'short';
      if (this.peek().value === 'int') {
        this.advance();
        typeName = 'short int';
      }
      return this.parseTypeSuffix(typeName);
    }

    const KNOWN_TYPE_NAMES = new Set([
      'int',
      'bool',
      'void',
      'auto',
      'string',
      'vector',
      'pair',
      'map',
      'unordered_map',
      'set',
      'unordered_set',
      'multiset',
      'stack',
      'queue',
      'deque',
      'priority_queue',
      'char',
      'float',
      'double',
      'TreeNode',
      'Node',
      'll',
      'ull',
      'pii',
      'pll',
      'vi',
      'vll',
      'vpii',
      'int32_t',
      'int64_t',
      'uint32_t',
      'uint64_t',
      'size_t',
    ]);

    if (KNOWN_TYPE_NAMES.has(token.value)) {
      this.advance();
      return this.parseTypeSuffix(token.value);
    }

    return null;
  }

  private parseTypeSuffix(typeName: string): string {
    // Handle template like vector<int> or vector<vector<int>> or priority_queue<int, vector<int>, greater<int>>
    if (this.match('OPERATOR', '<')) {
      let nested = 1;
      let inner = '<';
      while (!this.isAtEnd() && nested > 0) {
        const t = this.advance();
        if (t.value === '<') nested++;
        else if (t.value === '>') nested--;
        else if (t.value === '>>') {
          nested -= 2;
          inner += '>>';
          break;
        }
        inner += t.value;
      }
      typeName += inner;
    }

    // Handle references and pointers e.g. vector<int>& or int*
    while (this.match('OPERATOR', '&', '*')) {
      typeName += this.previous().value;
    }

    return typeName;
  }

  private parseFunctionDeclaration(
    returnType: string,
    name: string,
    line: number
  ): FunctionDeclNode {
    this.consume('PUNCTUATION', '(', "Expected '(' for function parameters");
    const params: { type: string; name: string }[] = [];

    if (!this.check('PUNCTUATION', ')')) {
      do {
        const paramType = this.parseType();
        if (!paramType) throw new Error(`Expected parameter type at line ${this.peek().line}`);
        const paramName = this.consume(
          'IDENTIFIER',
          '',
          'Expected parameter name'
        ).value;
        params.push({ type: paramType, name: paramName });
      } while (this.match('PUNCTUATION', ','));
    }

    this.consume('PUNCTUATION', ')', "Expected ')' after parameters");
    const body = this.parseBlockStatement();

    return {
      type: 'FunctionDeclaration',
      returnType,
      name,
      params,
      body,
      line,
    };
  }

  private parseVariableDeclarationRest(
    varType: string,
    name: string,
    line: number
  ): VariableDeclNode {
    const dimSizes: BaseASTNode[] = [];
    let isArray = false;

    // Check array brackets: e.g. dp[105][105]
    while (this.match('PUNCTUATION', '[')) {
      isArray = true;
      let sizeExpr: BaseASTNode | undefined;
      if (!this.check('PUNCTUATION', ']')) {
        sizeExpr = this.parseExpression();
      }
      this.consume('PUNCTUATION', ']', "Expected ']' for array size");
      if (sizeExpr) {
        dimSizes.push(sizeExpr);
      }
    }

    // Constructor call e.g. vector<int> dp(n + 1, 0)
    let constructorArgs: BaseASTNode[] | undefined;
    if (this.match('PUNCTUATION', '(')) {
      constructorArgs = [];
      if (!this.check('PUNCTUATION', ')')) {
        do {
          constructorArgs.push(this.parseExpression());
        } while (this.match('PUNCTUATION', ','));
      }
      this.consume('PUNCTUATION', ')', "Expected ')' after constructor arguments");
    }

    // Initializer e.g. = 0 or = {1, 2, 3}
    let initializer: BaseASTNode | undefined;
    if (this.match('OPERATOR', '=')) {
      initializer = this.parseExpression();
    }

    const declarations: VariableDeclarator[] = [
      {
        name,
        isArray,
        arraySize: dimSizes[0],
        dimSizes: dimSizes.length > 0 ? dimSizes : undefined,
        initializer,
        constructorArgs,
      },
    ];

    // Handle comma-separated declarations: int a = 1, b = 2;
    while (this.match('PUNCTUATION', ',')) {
      const nextName = this.consume('IDENTIFIER', '', 'Expected variable name after comma').value;
      const nextDimSizes: BaseASTNode[] = [];
      let nextIsArray = false;
      while (this.match('PUNCTUATION', '[')) {
        nextIsArray = true;
        let sExpr: BaseASTNode | undefined;
        if (!this.check('PUNCTUATION', ']')) {
          sExpr = this.parseExpression();
        }
        this.consume('PUNCTUATION', ']', "Expected ']'");
        if (sExpr) nextDimSizes.push(sExpr);
      }
      let nextInit: BaseASTNode | undefined;
      if (this.match('OPERATOR', '=')) {
        nextInit = this.parseExpression();
      }
      declarations.push({
        name: nextName,
        isArray: nextIsArray,
        arraySize: nextDimSizes[0],
        dimSizes: nextDimSizes.length > 0 ? nextDimSizes : undefined,
        initializer: nextInit,
      });
    }

    this.consume('PUNCTUATION', ';', "Expected ';' after variable declaration");

    return {
      type: 'VariableDeclaration',
      varType,
      name,
      isArray,
      arraySize: dimSizes[0],
      dimSizes: dimSizes.length > 0 ? dimSizes : undefined,
      constructorArgs,
      initializer,
      declarations,
      line,
    };
  }

  private parseBlockStatement(): BlockStatementNode {
    const startLine = this.peek().line;
    this.consume('PUNCTUATION', '{', "Expected '{'");
    const body: BaseASTNode[] = [];

    while (!this.check('PUNCTUATION', '}') && !this.isAtEnd()) {
      body.push(this.parseStatement());
    }

    this.consume('PUNCTUATION', '}', "Expected '}'");
    return {
      type: 'BlockStatement',
      body,
      line: startLine,
    };
  }

  private parseStatement(): BaseASTNode {
    const token = this.peek();

    // Block
    if (this.check('PUNCTUATION', '{')) {
      return this.parseBlockStatement();
    }

    // Empty statement
    if (this.match('PUNCTUATION', ';')) {
      return { type: 'EmptyStatement', line: token.line } as EmptyStatementNode;
    }

    // If
    if (this.match('KEYWORD', 'if')) {
      return this.parseIfStatement(token.line);
    }

    // While
    if (this.match('KEYWORD', 'while')) {
      return this.parseWhileStatement(token.line);
    }

    // For
    if (this.match('KEYWORD', 'for')) {
      return this.parseForStatement(token.line);
    }

    // Return
    if (this.match('KEYWORD', 'return')) {
      let argument: BaseASTNode | undefined;
      if (!this.check('PUNCTUATION', ';')) {
        argument = this.parseExpression();
      }
      this.consume('PUNCTUATION', ';', "Expected ';' after return");
      return {
        type: 'ReturnStatement',
        argument,
        line: token.line,
      } as ReturnStatementNode;
    }

    // Break
    if (this.match('KEYWORD', 'break')) {
      this.consume('PUNCTUATION', ';', "Expected ';' after break");
      return { type: 'BreakStatement', line: token.line } as BreakStatementNode;
    }

    // Continue
    if (this.match('KEYWORD', 'continue')) {
      this.consume('PUNCTUATION', ';', "Expected ';' after continue");
      return { type: 'ContinueStatement', line: token.line } as ContinueStatementNode;
    }

    // Variable declaration inside block
    const typeStr = this.parseType();
    if (typeStr) {
      if (this.match('PUNCTUATION', '[')) {
        const bindings: string[] = [];
        do {
          bindings.push(this.consume('IDENTIFIER', '', 'Expected identifier in structured binding').value);
        } while (this.match('PUNCTUATION', ','));
        this.consume('PUNCTUATION', ']', "Expected ']' in structured binding");
        this.consume('OPERATOR', '=', "Expected '=' in structured binding declaration");
        const initializer = this.parseExpression();
        this.consume('PUNCTUATION', ';', "Expected ';' after structured binding declaration");
        return {
          type: 'VariableDeclaration',
          varType: typeStr,
          name: bindings.join('_'),
          bindings,
          initializer,
          line: token.line,
        } as VariableDeclNode;
      }
      const name = this.consume('IDENTIFIER', '', 'Expected variable name').value;
      return this.parseVariableDeclarationRest(typeStr, name, token.line);
    }

    // Expression statement or assignment
    return this.parseExpressionOrAssignmentStatement();
  }

  private parseIfStatement(line: number): IfStatementNode {
    this.consume('PUNCTUATION', '(', "Expected '(' after 'if'");
    const condition = this.parseExpression();
    this.consume('PUNCTUATION', ')', "Expected ')' after condition");

    const consequent = this.parseStatement();
    let alternate: BaseASTNode | undefined;
    if (this.match('KEYWORD', 'else')) {
      alternate = this.parseStatement();
    }

    return {
      type: 'IfStatement',
      condition,
      consequent,
      alternate,
      line,
    };
  }

  private parseWhileStatement(line: number): WhileStatementNode {
    this.consume('PUNCTUATION', '(', "Expected '(' after 'while'");
    const condition = this.parseExpression();
    this.consume('PUNCTUATION', ')', "Expected ')' after condition");
    const body = this.parseStatement();
    return {
      type: 'WhileStatement',
      condition,
      body,
      line,
    };
  }

  private parseForStatement(line: number): ForStatementNode | RangeForStatementNode {
    this.consume('PUNCTUATION', '(', "Expected '(' after 'for'");

    // Check for Range-For: e.g. for (int coin : coins) or for (auto [u, v] : items)
    const savedPos = this.current;
    const typeStr = this.parseType();
    if (typeStr) {
      if (this.match('PUNCTUATION', '[')) {
        const bindings: string[] = [];
        do {
          bindings.push(this.consume('IDENTIFIER', '', 'Expected identifier in structured binding').value);
        } while (this.match('PUNCTUATION', ','));
        this.consume('PUNCTUATION', ']', "Expected ']' in structured binding");
        if (this.match('OPERATOR', ':')) {
          const iterable = this.parseExpression();
          this.consume('PUNCTUATION', ')', "Expected ')' after range-for iterable");
          const body = this.parseStatement();
          return {
            type: 'RangeForStatement',
            varType: typeStr,
            bindings,
            iterable,
            body,
            line,
          };
        }
      } else if (this.check('IDENTIFIER')) {
        const varName = this.advance().value;
        if (this.match('OPERATOR', ':')) {
          const iterable = this.parseExpression();
          this.consume('PUNCTUATION', ')', "Expected ')' after range-for iterable");
          const body = this.parseStatement();
          return {
            type: 'RangeForStatement',
            varType: typeStr,
            varName,
            iterable,
            body,
            line,
          };
        }
      }
    }
    // Rewind if not range-for
    this.current = savedPos;

    // Standard 3-clause for loop
    let init: BaseASTNode | undefined;
    if (!this.match('PUNCTUATION', ';')) {
      const initType = this.parseType();
      if (initType) {
        const name = this.consume('IDENTIFIER', '', 'Expected variable name in for init').value;
        init = this.parseVariableDeclarationRest(initType, name, line);
      } else {
        init = this.parseExpressionOrAssignmentStatement();
      }
    }

    let condition: BaseASTNode | undefined;
    if (!this.check('PUNCTUATION', ';')) {
      condition = this.parseExpression();
    }
    this.consume('PUNCTUATION', ';', "Expected ';' after for loop condition");

    let update: BaseASTNode | undefined;
    if (!this.check('PUNCTUATION', ')')) {
      const updates: BaseASTNode[] = [];
      do {
        updates.push(this.parseExpression());
      } while (this.match('PUNCTUATION', ','));
      update =
        updates.length === 1
          ? updates[0]
          : ({
              type: 'SequenceExpression',
              expressions: updates,
              line: updates[0].line,
            } as SequenceExpressionNode);
    }
    this.consume('PUNCTUATION', ')', "Expected ')' after for loop update");

    const body = this.parseStatement();
    return {
      type: 'ForStatement',
      init,
      condition,
      update,
      body,
      line,
    };
  }

  private parseExpressionOrAssignmentStatement(): BaseASTNode {
    const expr = this.parseExpression();

    // Check if this is an assignment: expr = right or expr += right
    if (
      this.match(
        'OPERATOR',
        '=',
        '+=',
        '-=',
        '*=',
        '/=',
        '%='
      )
    ) {
      const op = this.previous().value;
      const value = this.parseExpression();
      this.consume('PUNCTUATION', ';', "Expected ';' after assignment");

      if (expr.type === 'Identifier') {
        if (op === '=') {
          return {
            type: 'AssignmentStatement',
            target: (expr as IdentifierNode).name,
            value,
            line: expr.line,
          } as AssignmentStatementNode;
        } else {
          return {
            type: 'CompoundAssignmentStatement',
            target: expr,
            operator: op,
            value,
            line: expr.line,
          } as CompoundAssignmentStatementNode;
        }
      }

      if (
        expr.type === 'CallExpression' &&
        (expr as CallExpressionNode).callee === 'tie'
      ) {
        const vars = (expr as CallExpressionNode).args.map((a: any) =>
          a.type === 'Identifier' ? (a as IdentifierNode).name : 'ignore'
        );
        return {
          type: 'TieAssignmentStatement',
          variables: vars,
          value,
          line: expr.line,
        } as TieAssignmentStatementNode;
      }

      if (expr.type === 'MemberAccessExpression') {
        const mem = expr as MemberAccessExpressionNode;
        return {
          type: 'MemberAssignmentStatement',
          object: mem.object,
          property: mem.property,
          value,
          line: expr.line,
        } as MemberAssignmentStatementNode;
      }

      if (expr.type === 'IndexAccessExpression') {
        // Collect all chained indices: e.g. dp[i][j]
        const indices: BaseASTNode[] = [];
        let curr: BaseASTNode = expr;
        while (curr.type === 'IndexAccessExpression') {
          const idxAccess = curr as IndexAccessExpressionNode;
          indices.unshift(idxAccess.index);
          curr = idxAccess.array;
        }
        return {
          type: 'IndexAssignmentStatement',
          array: curr,
          indices,
          value,
          operator: op,
          line: expr.line,
        } as IndexAssignmentStatementNode;
      }
    }

    this.consume('PUNCTUATION', ';', "Expected ';' after expression");
    return {
      type: 'ExpressionStatement',
      expression: expr,
      line: expr.line,
    } as ExpressionStatementNode;
  }

  // Expression precedence climbing
  public parseExpression(): BaseASTNode {
    return this.parseConditional();
  }

  private parseConditional(): BaseASTNode {
    let expr = this.parseLogicalOr();
    if (this.match('OPERATOR', '?')) {
      const consequent = this.parseExpression();
      this.consume('OPERATOR', ':', "Expected ':' in conditional expression");
      const alternate = this.parseConditional();
      expr = {
        type: 'ConditionalExpression',
        condition: expr,
        consequent,
        alternate,
        line: expr.line,
      } as ConditionalExpressionNode;
    }
    return expr;
  }

  private parseLogicalOr(): BaseASTNode {
    let expr = this.parseLogicalAnd();
    while (this.match('OPERATOR', '||')) {
      const op = this.previous().value;
      const right = this.parseLogicalAnd();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseLogicalAnd(): BaseASTNode {
    let expr = this.parseBitwiseOr();
    while (this.match('OPERATOR', '&&')) {
      const op = this.previous().value;
      const right = this.parseBitwiseOr();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseBitwiseOr(): BaseASTNode {
    let expr = this.parseBitwiseXor();
    while (this.match('OPERATOR', '|')) {
      const op = this.previous().value;
      const right = this.parseBitwiseXor();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseBitwiseXor(): BaseASTNode {
    let expr = this.parseBitwiseAnd();
    while (this.match('OPERATOR', '^')) {
      const op = this.previous().value;
      const right = this.parseBitwiseAnd();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseBitwiseAnd(): BaseASTNode {
    let expr = this.parseEquality();
    while (this.match('OPERATOR', '&')) {
      const op = this.previous().value;
      const right = this.parseEquality();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseEquality(): BaseASTNode {
    let expr = this.parseRelational();
    while (this.match('OPERATOR', '==', '!=')) {
      const op = this.previous().value;
      const right = this.parseRelational();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseRelational(): BaseASTNode {
    let expr = this.parseShift();
    while (this.match('OPERATOR', '<', '<=', '>', '>=')) {
      const op = this.previous().value;
      const right = this.parseShift();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseShift(): BaseASTNode {
    let expr = this.parseAdditive();
    while (this.match('OPERATOR', '<<', '>>')) {
      const op = this.previous().value;
      const right = this.parseAdditive();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseAdditive(): BaseASTNode {
    let expr = this.parseMultiplicative();
    while (this.match('OPERATOR', '+', '-')) {
      const op = this.previous().value;
      const right = this.parseMultiplicative();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseMultiplicative(): BaseASTNode {
    let expr = this.parseUnary();
    while (this.match('OPERATOR', '*', '/', '%')) {
      const op = this.previous().value;
      const right = this.parseUnary();
      expr = {
        type: 'BinaryExpression',
        operator: op,
        left: expr,
        right,
        line: expr.line,
      } as BinaryExpressionNode;
    }
    return expr;
  }

  private parseUnary(): BaseASTNode {
    // C-style type cast: (int)x, (long long)x, (ll)x, (double)x
    if (this.check('PUNCTUATION', '(')) {
      const savedPos = this.current;
      this.advance(); // consume '('
      const castType = this.parseType();
      if (castType && this.match('PUNCTUATION', ')')) {
        const arg = this.parseUnary();
        return {
          type: 'TypeCastExpression',
          targetType: castType,
          argument: arg,
          line: this.previous().line,
        } as TypeCastExpressionNode;
      }
      this.current = savedPos; // rewind if not a cast
    }

    // sizeof(...) expression
    if (this.match('KEYWORD', 'sizeof') || this.match('IDENTIFIER', 'sizeof')) {
      this.consume('PUNCTUATION', '(', "Expected '(' after sizeof");
      let depth = 1;
      while (!this.isAtEnd() && depth > 0) {
        const t = this.advance();
        if (t.value === '(') depth++;
        else if (t.value === ')') depth--;
      }
      return {
        type: 'Literal',
        value: 4,
        raw: '4',
        line: this.previous().line,
      } as LiteralNode;
    }

    if (this.match('OPERATOR', '!', '-', '+', '~', '*')) {
      const op = this.previous().value;
      const arg = this.parseUnary();
      return {
        type: 'UnaryExpression',
        operator: op,
        argument: arg,
        prefix: true,
        line: this.previous().line,
      } as UnaryExpressionNode;
    }

    if (this.match('OPERATOR', '++', '--')) {
      const op = this.previous().value as '++' | '--';
      const arg = this.parseUnary();
      return {
        type: 'UpdateExpression',
        operator: op,
        argument: arg,
        prefix: true,
        line: this.previous().line,
      } as UpdateExpressionNode;
    }

    return this.parsePostfix();
  }

  private parsePostfix(): BaseASTNode {
    let expr = this.parsePrimary();

    while (true) {
      // Member call or access: expr.method() or expr.field or expr->field or ns::field
      if (this.match('OPERATOR', '.', '->', '::')) {
        const prop = this.consume('IDENTIFIER', '', 'Expected property name').value;
        if (this.match('PUNCTUATION', '(')) {
          const args: BaseASTNode[] = [];
          if (!this.check('PUNCTUATION', ')')) {
            do {
              args.push(this.parseExpression());
            } while (this.match('PUNCTUATION', ','));
          }
          this.consume('PUNCTUATION', ')', "Expected ')' after method arguments");
          expr = {
            type: 'MemberCallExpression',
            object: expr,
            method: prop,
            args,
            line: expr.line,
          } as MemberCallExpressionNode;
        } else {
          expr = {
            type: 'MemberAccessExpression',
            object: expr,
            property: prop,
            line: expr.line,
          } as MemberAccessExpressionNode;
        }
        continue;
      }

      // Index access: expr[idx]
      if (this.match('PUNCTUATION', '[')) {
        const index = this.parseExpression();
        this.consume('PUNCTUATION', ']', "Expected ']'");
        expr = {
          type: 'IndexAccessExpression',
          array: expr,
          index,
          line: expr.line,
        } as IndexAccessExpressionNode;
        continue;
      }

      // Function call: expr(args)
      if (this.match('PUNCTUATION', '(')) {
        const args: BaseASTNode[] = [];
        if (!this.check('PUNCTUATION', ')')) {
          do {
            args.push(this.parseExpression());
          } while (this.match('PUNCTUATION', ','));
        }
        this.consume('PUNCTUATION', ')', "Expected ')' after call arguments");

        const calleeName = expr.type === 'Identifier' ? (expr as IdentifierNode).name : 'anon';
        expr = {
          type: 'CallExpression',
          callee: calleeName,
          args,
          line: expr.line,
        } as CallExpressionNode;
        continue;
      }

      // Postfix ++ or --
      if (this.match('OPERATOR', '++', '--')) {
        expr = {
          type: 'UpdateExpression',
          operator: this.previous().value as '++' | '--',
          argument: expr,
          prefix: false,
          line: expr.line,
        } as UpdateExpressionNode;
        continue;
      }

      break;
    }

    return expr;
  }

  private parsePrimary(): BaseASTNode {
    const token = this.peek();

    // Grouping: ( expr )
    if (this.match('PUNCTUATION', '(')) {
      const expr = this.parseExpression();
      this.consume('PUNCTUATION', ')', "Expected ')' after expression");
      return expr;
    }

    // Array literal: { 1, 2, 3 }
    if (this.match('PUNCTUATION', '{')) {
      const elements: BaseASTNode[] = [];
      if (!this.check('PUNCTUATION', '}')) {
        do {
          elements.push(this.parseExpression());
        } while (this.match('PUNCTUATION', ','));
      }
      this.consume('PUNCTUATION', '}', "Expected '}'");
      return {
        type: 'ArrayLiteral',
        elements,
        line: token.line,
      } as ArrayLiteralNode;
    }

    // Number literal
    if (this.match('NUMBER')) {
      const val = Number(this.previous().value);
      return {
        type: 'Literal',
        value: val,
        raw: this.previous().value,
        line: token.line,
      } as LiteralNode;
    }

    // String literal
    if (this.match('STRING')) {
      return {
        type: 'Literal',
        value: this.previous().value,
        raw: `"${this.previous().value}"`,
        line: token.line,
      } as LiteralNode;
    }

    // Booleans and nulls
    if (this.match('KEYWORD', 'true')) {
      return { type: 'Literal', value: true, raw: 'true', line: token.line } as LiteralNode;
    }
    if (this.match('KEYWORD', 'false')) {
      return { type: 'Literal', value: false, raw: 'false', line: token.line } as LiteralNode;
    }
    if (this.match('KEYWORD', 'nullptr', 'NULL')) {
      return { type: 'Literal', value: null, raw: 'nullptr', line: token.line } as LiteralNode;
    }

    // Vector constructor expression: vector<int>(n, val)
    if (this.match('KEYWORD', 'vector')) {
      let typeName = 'vector';
      if (this.match('OPERATOR', '<')) {
        let nested = 1;
        let inner = '<';
        while (!this.isAtEnd() && nested > 0) {
          const t = this.advance();
          if (t.value === '<') nested++;
          else if (t.value === '>') nested--;
          else if (t.value === '>>') {
            nested -= 2;
            inner += '>>';
            break;
          }
          inner += t.value;
        }
        typeName += inner;
      }

      this.consume('PUNCTUATION', '(', "Expected '(' for constructor");
      const args: BaseASTNode[] = [];
      if (!this.check('PUNCTUATION', ')')) {
        do {
          args.push(this.parseExpression());
        } while (this.match('PUNCTUATION', ','));
      }
      this.consume('PUNCTUATION', ')', "Expected ')' after constructor args");

      return {
        type: 'CallExpression',
        callee: typeName,
        args,
        line: token.line,
      } as CallExpressionNode;
    }

    // Constructor / functional cast expressions: int(x), double(x), long(x), char(x), etc.
    if (this.match('KEYWORD', 'int', 'long', 'double', 'float', 'char', 'bool', 'short', 'signed', 'unsigned')) {
      const typeName = this.previous().value;
      if (this.match('PUNCTUATION', '(')) {
        const args: BaseASTNode[] = [];
        if (!this.check('PUNCTUATION', ')')) {
          do {
            args.push(this.parseExpression());
          } while (this.match('PUNCTUATION', ','));
        }
        this.consume('PUNCTUATION', ')', "Expected ')' after functional cast");
        return {
          type: 'CallExpression',
          callee: typeName,
          args,
          line: token.line,
        } as CallExpressionNode;
      }
    }

    // Comparator / functor objects: greater<int>(), greater<>(), less<int>(), less<>()
    if (
      this.check('IDENTIFIER') &&
      (this.peek().value === 'greater' || this.peek().value === 'less') &&
      this.current + 1 < this.tokens.length &&
      this.tokens[this.current + 1].value === '<'
    ) {
      const compName = this.advance().value;
      this.advance(); // consume '<'
      let nested = 1;
      let inner = '<';
      while (!this.isAtEnd() && nested > 0) {
        const t = this.advance();
        if (t.value === '<') nested++;
        else if (t.value === '>') nested--;
        else if (t.value === '>>') {
          nested -= 2;
          inner += '>>';
          break;
        }
        inner += t.value;
      }
      if (this.match('PUNCTUATION', '(')) {
        this.consume('PUNCTUATION', ')', "Expected ')' after comparator");
      }
      return {
        type: 'Literal',
        value: compName,
        raw: `${compName}${inner}()`,
        line: token.line,
      } as LiteralNode;
    }

    // Identifier / Keyword functions like max, min, cout, cin, endl
    if (
      this.match('IDENTIFIER') ||
      this.match('KEYWORD', 'max', 'min', 'swap', 'memset', 'cin', 'cout', 'endl')
    ) {
      return {
        type: 'Identifier',
        name: this.previous().value,
        line: token.line,
      } as IdentifierNode;
    }

    throw new Error(`Unexpected token '${token.value}' at line ${token.line}`);
  }
}
