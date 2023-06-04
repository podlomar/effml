import { encode } from 'html-entities';
import { EffmlDocument } from '../ast.js';
import { Visitor } from '../visitor.js';
import { transformDocument } from './index.js';
import { indent, PrintType } from './utils.js';

export const documentToHtml = (
  document: EffmlDocument, printType: PrintType = 'pretty'
): string => {
  const nl = printType === 'pretty' ? '\n' : '';
  const indt = printType === 'pretty' ? indent : (value: string) => value;
  
  const visitor: Visitor<string, string, string, string> = {
    attribute: (name, value) => ` ${name}="${encode(value)}"`,
    text: (value, level) => indt(encode(value), level),
    element: (name, attrs, nodes, level) => {
      const htmlAttrs = attrs.join('');
      if (nodes.length === 0) {
        return indt(`<${name}${htmlAttrs} />`, level);
      } else {
        const htmlNodes = nodes.join(nl);
        return (
          indt(`<${name}${htmlAttrs}>${nl}`, level) + 
          `${htmlNodes}${nl}` +
          indt(`</${name}>`, level)
        );
      }
    },
    document: (attrs, nodes) => {
      if (attrs.find((attr) => attr.startsWith(' doctype='))) {
        return `<!DOCTYPE html>\n${nodes.join('')}`;
      }
  
      return nodes.join('');
    },
  };

  return transformDocument(document, visitor);
};
