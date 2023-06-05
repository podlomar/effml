import { promises as fs } from 'fs';
import { parse, walk, SyntaxKind } from 'html5parser';
import { decode } from 'html-entities';
import { documentToString } from '../dist/transform/to-string.js';
import { documentToHtml } from '../dist/transform/to-html.js';

const inputFile = process.argv[2] ?? 'small';
const output = process.argv[3] ?? 'string';
const print = process.argv[4] ?? 'pretty';

const input = await fs.readFile(`assets/${inputFile}.html`, 'utf8');

const ast = parse(input.trim());

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

if (output === 'json') {
  console.log(JSON.stringify(contentStack[0], null, 2));
} else if (output === 'html') {
  console.log(documentToHtml(contentStack[0], print));
} else if (output === 'string'){
  console.log(documentToString(contentStack[0], print));
} else {
  console.log('Unknown output type');
}
