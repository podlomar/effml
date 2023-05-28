export interface ParsingError {
  code: string;
  message: string;
  line: number;
  column: number;
}

export const isParsingError = (value: any): value is ParsingError => {
  return value && typeof value === 'object' && 'code' in value;
};

type ParsingErrors = {
  [ key: string ]: (line: number, column: number, ...args: any[]) => ParsingError;
}

export const errors: ParsingErrors = {
  unexpectedEof: (line, column) => ({
    code: 'unexpected-eof',
    message: 'Unexpected end of input',
    line,
    column,
  }),
  unexpectedToken: (line, column, token: string) => ({
    code: 'unexpected-token',
    message: `Unexpected token ${token}`,
    line,
    column,
  }),
};
