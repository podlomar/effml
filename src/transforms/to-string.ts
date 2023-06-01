import { Attributes, EffmlDocument, Node } from '../ast.js';

const indent = (level: number): string => '  '.repeat(level);

type FormatType = 'pretty' | 'minify';

export const documentToString = (
  document: EffmlDocument, printType: FormatType = 'pretty'
): string => {
  const { attrs, nodes } = document;
  return stringifyContent(attrs, nodes, 0, printType);
};

const escapeChars: { [key: string]: string } = {
  '\n': '\\n',
  '\t': '\\t',
  '\r': '\\r',
  '\f': '\\f',
  '\b': '\\b',
  '\\': '\\\\',
  '\'': '\\\'',
};

const ESCAPE_REGEX = /[\n\t\r\f\b\\']/g;

const escape = (matched: string): string => escapeChars[matched];

const stringifyContent = (
  attrs: Attributes,
  nodes: Node[],
  indentLevel: number,
  printType: FormatType,
): string => {
  let result = '';

  const nl = printType === 'pretty' ? '\n' : '';
  const sp = printType === 'pretty' ? ' ' : '';
  const indt = printType === 'pretty' ? indent(indentLevel) : '';

  for (const [key, value] of Object.entries(attrs)) {
    result += `${indt}${key}${sp}'${value.replace(ESCAPE_REGEX, escape)}'${nl}`;
  }

  for (const node of nodes) {
    if (node.type === 'text') {
      result += `${indt}'${node.value.replace(ESCAPE_REGEX, escape)}'${nl}`;
    } else {
      result += `${indt}${node.name}${sp}{${nl}`;
      result += stringifyContent(node.attrs, node.nodes, indentLevel + 1, printType);
      result += `${indt}}${nl}`;
    }
  }

  return result;
};
