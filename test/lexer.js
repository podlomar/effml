import { expect } from 'chai';
import { tokenize, TokenType } from '../dist/lexer.js';

describe('Tokenize', () => {
  it('should handle empty input', () => {
    const input = "";
    const expectedTokens = [];

    const result = Array.from(tokenize(input));
    expect(result).to.deep.equal(expectedTokens);
  });

  it('should handle input with just text', () => {
    const input = "'Hello, World!'";
    const expectedTokens = [
      { type: TokenType.Text, value: 'Hello, World!', start: 0, end: 14, line: 1, column: 1 }
    ];

    const result = Array.from(tokenize(input));
    expect(result).to.deep.equal(expectedTokens);
  });

  it('should handle attributes', () => {
    const input = "text 'inside quotes'";
    const expectedTokens = [
      { type: TokenType.Name, value: 'text', start: 0, end: 3, line: 1, column: 1 },
      { type: TokenType.Text, value: 'inside quotes', start: 5, end: 19, line: 1, column: 6 }
    ];

    const result = Array.from(tokenize(input));
    expect(result).to.deep.equal(expectedTokens);
  });

  it('should handle escaped quotes', () => {
    const input = "'Hello, \\'World\\''";
    const expectedTokens = [
      { type: TokenType.Text, value: "Hello, 'World'", start: 0, end: 17, line: 1, column: 1 }
    ];

    const result = Array.from(tokenize(input));
    expect(result).to.deep.equal(expectedTokens);
  });

  it('should tokenize input string correctly', () => {
    const input = "doctype'html'head{title'Page Title'}body{h1'Hello, World!''Hello, World!'}";
    const expectedTokens = [
      { type: TokenType.Name, value: 'doctype', start: 0, end: 6, line: 1, column: 1 },
      { type: TokenType.Text, value: 'html', start: 7, end: 12, line: 1, column: 8 },
      { type: TokenType.Name, value: 'head', start: 13, end: 16, line: 1, column: 14 },
      { type: TokenType.OpenBrace, value: '{', start: 17, end: 18, line: 1, column: 18 },
      { type: TokenType.Name, value: 'title', start: 18, end: 22, line: 1, column: 19 },
      { type: TokenType.Text, value: 'Page Title', start: 23, end: 34, line: 1, column: 24 },
      { type: TokenType.CloseBrace, value: '}', start: 35, end: 36, line: 1, column: 36 },
      { type: TokenType.Name, value: 'body', start: 36, end: 39, line: 1, column: 37 },
      { type: TokenType.OpenBrace, value: '{', start: 40, end: 41, line: 1, column: 41 },
      { type: TokenType.Name, value: 'h1', start: 41, end: 42, line: 1, column: 42 },
      { type: TokenType.Text, value: 'Hello, World!', start: 43, end: 57, line: 1, column: 44 },
      { type: TokenType.Text, value: 'Hello, World!', start: 58, end: 72, line: 1, column: 59 },
      { type: TokenType.CloseBrace, value: '}', start: 73, end: 74, line: 1, column: 74 }
    ];

    const result = Array.from(tokenize(input));

    expect(result).to.deep.equal(expectedTokens);
  });

  it('should handle newline characters correctly', () => {
    const input = "hello\n'world'";
    const expectedTokens = [
      { type: TokenType.Name, value: 'hello', start: 0, end: 4, line: 1, column: 1 },
      { type: TokenType.Text, value: 'world', start: 6, end: 12, line: 2, column: 1 }
    ];

    const result = Array.from(tokenize(input));

    expect(result).to.deep.equal(expectedTokens);
  });

  it('should handle invalid names', () => {
    const input = "3hello/world: '123'";

    const result = Array.from(tokenize(input));
    const expectedTokens = [
      { code: 'invalid-token', message: 'Invalid token 3hello/world:', column: 1, line: 1 },
    ];

    expect(result).to.deep.equal(expectedTokens);
  });
});
