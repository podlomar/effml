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


  // it('should tokenize input string correctly', () => {
  //   const input = "hello {'World'}";
  //   const expectedTokens = [
  //     { type: TokenType.Name, value: 'Hello', start: 0, end: 4, line: 1, column: 1 },
  //     { type: TokenType.OpenBrace, value: '{', start: 6, end: 6, line: 1, column: 7 },
  //     { type: TokenType.Name, value: 'World', start: 7, end: 11, line: 1, column: 8 },
  //     { type: TokenType.CloseBrace, value: '}', start: 12, end: 12, line: 1, column: 13 }
  //   ];

  //   const result = Array.from(tokenize(input));

  //   expect(result).to.deep.equal(expectedTokens);
  // });

  // it('should handle newline characters correctly', () => {
  //   const input = "Hello\nWorld";
  //   const expectedTokens = [
  //     { type: TokenType.Name, value: 'Hello', start: 0, end: 4, line: 1, column: 1 },
  //     { type: TokenType.Name, value: 'World', start: 6, end: 10, line: 2, column: 1 }
  //   ];

  //   const result = Array.from(tokenize(input));

  //   expect(result).to.deep.equal(expectedTokens);
  // });

  // it('should handle multiple tokens with spaces correctly', () => {
  //   const input = "This is a test";
  //   const expectedTokens = [
  //     { type: TokenType.Name, value: 'This', start: 0, end: 3, line: 1, column: 1 },
  //     { type: TokenType.Name, value: 'is', start: 5, end: 6, line: 1, column: 5 },
  //     { type: TokenType.Name, value: 'a', start: 8, end: 8, line: 1, column: 7 },
  //     { type: TokenType.Name, value: 'test', start: 10, end: 13, line: 1, column: 9 }
  //   ];

  //   const result = Array.from(tokenize(input));

  //   expect(result).to.deep.equal(expectedTokens);
  // });
});
