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

enum State {
  Content = 0,
  Text = 1,
}

const NAME_START_CHAR = /[:A-Z_a-z\xc0-\xd6\xd8-\xff]/;
const NAME_CHAR = new RegExp(`${NAME_START_CHAR.source}|[-.0-9\\xb7]`);
const NAME = new RegExp(`^${NAME_START_CHAR.source}(${NAME_CHAR.source})*\$`);

export function* tokenize(input: string): Generator<Token | ParsingError> {
  let state: State = State.Content;
  let stateStart = {
    pos: 0,
    line: 1,
    column: 1,
  };
  let pos = 0;
  let line = 1;
  let column = 1;
  let currentText = '';

  while (pos < input.length) {
    const char = input[pos];

    if (state === State.Text) {
      if (char === '\\') {
        const nextChar = input[pos + 1];
        if (nextChar === 'n') {
          currentText += '\n';
          pos += 2;
          column += 2;
        } else if (nextChar === 't') {
          currentText += '\t';
          pos += 2;
          column += 2;
        } else if (nextChar === 'r') {
          currentText += '\r';
          pos += 2;
          column += 2;
        } else if (nextChar === 'f') {
          currentText += '\f';
          pos += 2;
          column += 2;
        } else if (nextChar === 'b') {
          currentText += '\b';
          pos += 2;
          column += 2;
        } else if (nextChar === '\\') {
          currentText += '\\';
          pos += 2;
          column += 2;
        } else if (nextChar === '\'') {
          currentText += '\'';
          pos += 2;
          column += 2;
        } else {
          yield errors.invalidEscapeSequence(line, column, nextChar);
          return;
        }
      } else if (char === '\'') {
        yield {
          type: TokenType.Text,
          value: currentText,
          start: stateStart.pos,
          end: pos,
          line: stateStart.line,
          column: stateStart.column,
        };
        currentText = '';
        state = State.Content;
        pos++;
        column++;
        stateStart = {
          pos,
          line,
          column,
        };
      } else {
        currentText += char;
        pos++;
        column++;
      }
      continue;
    }

    if (DELIMITER.test(char)) {
      if (currentText.length > 0) {
        if (NAME.test(currentText)) {
          yield {
            type: TokenType.Name,
            value: currentText,
            start: pos - currentText.length,
            end: pos - 1,
            line,
            column: column - currentText.length,
          };
          currentText = '';
        } else {
          yield errors.invalidToken(line, column - currentText.length, currentText);
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
      state = State.Text;
      stateStart = { pos, line, column };
      pos++;
      column++;
    } else {
      currentText += char;
      pos++;
      column++;
    }
  }
};
