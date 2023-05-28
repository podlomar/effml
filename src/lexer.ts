export enum TokenType {
  Name = 0,
  Text = 1,
  OpenBrace = 2,
  CloseBrace = 3,
}

export type Token = {
  type: TokenType;
  value: string;
  start: number;
  end: number;
  line: number;
  column: number;
};

const DELIMITER = /[\s{}']/;

export function* tokenize(input: string): Generator<Token> {
  let pos = 0;
  let line = 1;
  let column = 1;
  let currentName = '';

  while (pos < input.length) {
    const char = input[pos];

    if (DELIMITER.test(char)) {
      if (currentName.length > 0) {
        yield {
          type: TokenType.Name,
          value: currentName,
          start: pos - currentName.length,
          end: pos - 1,
          line,
          column: column - currentName.length,
        };
        currentName = '';
      }
    }

    if (char === '{') {
      yield {
        type: TokenType.OpenBrace,
        value: '{',
        start: pos,
        end: pos + 1,
        line,
        column,
      };
      pos++;
      column++;
    } else if (char === '}') {
      yield {
        type: TokenType.CloseBrace,
        value: '}',
        start: pos,
        end: pos + 1,
        line,
        column,
      };
      pos++;
      column++;
    } else if (char === '\n') {
      line++;
      column = 1;
      pos++;
    } else if (/[\s]/.test(char)) {
      pos++;
      column++;
    } else if (char === `'`) {
      const quoteEnd = input.indexOf(`'`, pos + 1);
      const value = input.slice(pos + 1, quoteEnd);

      yield {
        type: TokenType.Text,
        value,
        start: pos,
        end: quoteEnd,
        line,
        column,
      };

      pos = quoteEnd + 1;
      column += value.length + 2;
    } else {
      currentName += char;
      pos++;
      column++;
    }
  }
};
