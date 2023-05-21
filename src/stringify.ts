import { Attributes, EffmlDocument, Node } from './ast.js';

const indent = (level: number): string => '  '.repeat(level);

type PrintType = 'pretty' | 'minify';

export const effmlStringify = (document: EffmlDocument, printType: PrintType = 'pretty'): string => {
  const { attributes, nodes } = document;
  return stringifyContent(attributes, nodes, 0, printType);
};

const stringifyContent = (
  attributes: Attributes,
  nodes: Node[],
  indentLevel: number,
  printType: PrintType,
): string => {
  let result = '';

  const nl = printType === 'pretty' ? '\n' : '';
  const sp = printType === 'pretty' ? ' ' : '';
  const indt = printType === 'pretty' ? indent(indentLevel) : '';

  for (const [key, value] of Object.entries(attributes)) {
    result += `${indt}${key}${sp}'${value}'${nl}`;
  }

  for (const node of nodes) {
    if (node.type === 'text') {
      result += `${indt}'${node.value}'${nl}`;
    } else {
      result += `${indt}${node.tagName}${sp}{${nl}`;
      result += stringifyContent(node.attributes, node.nodes, indentLevel + 1, printType);
      result += `${indt}}${nl}`;
    }
  }

  return result;
};
