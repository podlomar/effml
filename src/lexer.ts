import { errors, ParsingError } from "./errors.js";

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

const NAME_START_CHAR = /[:A-Z_a-z\xc0-\xd6\xd8-\xff]/;
const NAME_CHAR = new RegExp(`${NAME_START_CHAR.source}|[-.0-9\\xb7]`);
const NAME = new RegExp(`^${NAME_START_CHAR.source}(${NAME_CHAR.source})*\$`);

export function* tokenize(input: string): Generator<Token | ParsingError> {
  let pos = 0;
  let line = 1;
  let column = 1;
  let currentName = '';

  while (pos < input.length) {
    const char = input[pos];

    if (DELIMITER.test(char)) {
      if (currentName.length > 0) {
        if (NAME.test(currentName)) {
          yield {
            type: TokenType.Name,
            value: currentName,
            start: pos - currentName.length,
            end: pos - 1,
            line,
            column: column - currentName.length,
          };
          currentName = '';
        } else {
          yield errors.invalidToken(line, column - currentName.length, currentName);
          return;
        }
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
      let quotePos = input.indexOf(`'`, pos + 1);
      while (quotePos !== -1 && input[quotePos - 1] === '\\') {
        quotePos = input.indexOf(`'`, quotePos + 1);
      }
      const value = input.slice(pos + 1, quotePos).replace(/\\'/g, `'`);

      yield {
        type: TokenType.Text,
        value,
        start: pos,
        end: quotePos,
        line,
        column,
      };

      pos = quotePos + 1;
      column += value.length + 2;
    } else {
      currentName += char;
      pos++;
      column++;
    }
  }
};
