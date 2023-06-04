import { promises as fs } from 'fs';
import { expect } from 'chai';
import { documentToString } from '../dist/transform/to-string.js';

const sampleOutput = await fs.readFile('./test/assets/small.effml', 'utf-8');
const sampleOutputMin = await fs.readFile('./test/assets/small.min.effml', 'utf-8');
const sampleAst = JSON.parse(await fs.readFile('./test/assets/small.json', 'utf-8'));

describe('Effml stringify', () => {
  it('should stringify empty input', () => {
    const input = { attrs: {}, nodes: []};
    const result = documentToString(input);

    expect(result).to.deep.equal('');
  });

  it('should stringify Effml content with elements and attributes', () => {
    const result = documentToString(sampleAst);
    expect(result).to.deep.equal(sampleOutput);
  });

  it('should stringify and minify Effml content with elements and attributes', () => {
    const result = documentToString(sampleAst, 'minify');
    expect(result).to.deep.equal(sampleOutputMin);
  });
});
