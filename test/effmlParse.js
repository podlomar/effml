import { promises as fs } from 'fs';
import { parseToAst } from '../dist/index.js';
import { documentToString } from '../dist/transform/to-string.js';
import { documentToHtml } from '../dist/transform/to-html.js';

const effmlContent = await fs.readFile('assets/small.effml', 'utf8');
const ast = parseToAst(effmlContent);

console.log(JSON.stringify(ast, null, 2));
console.log(documentToString(ast, 'pretty'));
console.log(documentToHtml(ast, 'pretty'));
