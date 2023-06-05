import { promises as fs } from 'fs';
import { expect } from 'chai';
import { documentToHtml } from '../dist/transform/to-html.js';

const sampleOutput = await fs.readFile('./test/assets/small.html', 'utf-8');
const sampleAst = JSON.parse(await fs.readFile('./test/assets/small.json', 'utf-8'));

describe('Effml htmlify', () => {
  it('should htmlify empty input', () => {
    const input = { attrs: {}, nodes: []};
    const result = documentToHtml(input);

    expect(result).to.deep.equal('\n');
  });

  it('should htmlify Effml content with elements and attributes', () => {
    const result = documentToHtml(sampleAst);
    expect(result).to.deep.equal(sampleOutput);
  });

  // it('should stringify and minify Effml content with elements and attributes', () => {
  //   const result = documentToString(sampleAst, 'minify');
  //   expect(result).to.deep.equal(sampleOutputMin);
  // });
});
