import { promises as fs } from 'fs';
import { parse, walk, SyntaxKind } from 'html5parser';
import { documentToString } from '../dist/transforms/to-string.js';

const htmlContent = await fs.readFile('assets/big.html', 'utf8');

const ast = parse(htmlContent);

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
        acc[attr.name.value] = attr.value.value;
        return acc;
      }, {});

      const newNode = { type: 'element', name, attrs, nodes: [] };  
      currentContent.nodes.push(newNode);
      contentStack.push(newNode);
      return;
    }
    
    if (node.type === SyntaxKind.Text) {
      currentContent.nodes.push({ type: 'text', value: node.value });
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

// console.log(JSON.stringify(contentStack[0], null, 2));
// console.log(documentToString(contentStack[0], 'minify'));
