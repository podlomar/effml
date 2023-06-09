import { encode, EncodeOptions } from 'html-entities';
import { EffmlDocument } from '../ast.js';
import { Visitor } from '../visitor.js';
import { transformDocument } from './index.js';
import { indent, PrintType } from './utils.js';

const entities: { [key: string]: string } = {
  '\r': '&#xD;',
  '\f': '&#xC;',
  '\b': '&#x8;',
};

const ENTITIES_REGEX = /[\r\f\b]/g;

const replaceEntity = (matched: string): string => entities[matched];

const encodeHtml = (value: string): string => encode(value.trim())
  .replace(ENTITIES_REGEX, replaceEntity)
  .replace(/\s+/g, ' ');

export const documentToHtml = (
  document: EffmlDocument, printType: PrintType = 'pretty'
): string => {
  const nl = printType === 'pretty' ? '\n' : '';
  const indt = printType === 'pretty' ? indent : (value: string) => value;
  
  const visitor: Visitor<string, string, string, string> = {
    attribute: (name, value) => ` ${name}="${encodeHtml(value)}"`,
    text: (value, level) => indt(encodeHtml(value), level),
    element: (name, attrs, nodes, level) => {
      const htmlAttrs = attrs.join('');
      if (nodes.length === 0) {
        return indt(`<${name}${htmlAttrs} />`, level);
      } else {
        const htmlNodes = nodes.reduce((result, node) => (
          node === '' ? result : result + nl + node
        ), '');

        return (
          indt(`<${name}${htmlAttrs}>`, level) + 
          `${htmlNodes}${nl}` +
          indt(`</${name}>`, level)
        );
      }
    },
    document: (attrs, nodes) => {
      if (attrs.find((attr) => attr.startsWith(' doctype='))) {
        return `<!DOCTYPE html>${nl}${nodes.join('')}${nl}`;
      }
  
      return `${nodes.join('')}${nl}`;
    },
  };

  return transformDocument(document, visitor);
};
