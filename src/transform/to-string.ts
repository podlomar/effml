import { EffmlDocument } from '../ast.js';
import { Visitor } from '../visitor.js';
import { transformDocument } from './index.js';
import { indent, PrintType } from './utils.js';

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

export const documentToString = (
  document: EffmlDocument, printType: PrintType = 'pretty'
): string => {
  const nl = printType === 'pretty' ? '\n' : '';
  const sp = printType === 'pretty' ? ' ' : '';
  const indt = printType === 'pretty' ? indent : (value: string) => value;
  
  const visitor: Visitor<string, string, string, string> = {
    attribute: (name, value, level) => indt(
      `${name}${sp}'${value.replace(ESCAPE_REGEX, escape)}'${nl}`,
      level === 0 ? 0 : level + 1,
    ),
    text: (value, level) => indt(`'${value.replace(ESCAPE_REGEX, escape)}'${nl}`, level),
    element: (name, attrs, nodes, level) => {
      const stringAttrs = attrs.join('');
      return (
        indt(`${name}${sp}{${nl}`, level) +
        stringAttrs +
        nodes.join('') +
        indt(`}${nl}`, level)
      );
    },
    document: (attrs, nodes) => attrs.join('') + nodes.join(''),
  };

  return transformDocument(document, visitor);
};
