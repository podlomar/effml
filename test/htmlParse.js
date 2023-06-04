import { promises as fs } from 'fs';
import { parse, walk, SyntaxKind } from 'html5parser';
import { decode } from 'html-entities';
import { documentToString } from '../dist/transforms/to-string.js';

const htmlContent = await fs.readFile('assets/small.html', 'utf8');

const ast = parse(htmlContent.trim());

const contentStack = [{
  attrs: {},
  nodes: [],
}];

walk(ast, {
  enter: (node) => {
    const currentContent = contentStack[contentStack.length - 1];

    if (node.type === SyntaxKind.Tag) {
      const name = node.name;

      if (name === '!doctype') {
        currentContent.attrs.doctype = 'html';
        return;  
      }

      const attrs = node.attributes.reduce((acc, attr) => {
        acc[attr.name.value] = decode(attr.value.value);
        return acc;
      }, {});

      const newNode = { type: 'element', name, attrs, nodes: [] };  
      currentContent.nodes.push(newNode);
      contentStack.push(newNode);
      return;
    }
    
    if (node.type === SyntaxKind.Text) {
      const trimmed = node.value.trim();
      if (trimmed === '') {
        return;
      }
      currentContent.nodes.push({ type: 'text', value: decode(trimmed) });
    }
  },
  leave: (node) => {
    if (node.type === SyntaxKind.Tag) {
      if (node.name === '!doctype') {
        return;
      }
      contentStack.pop();
    }
  }
});

console.log(JSON.stringify(contentStack[0], null, 2));
console.log(documentToString(contentStack[0], 'pretty'));
