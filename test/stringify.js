import { promises as fs } from 'fs';
import { expect } from 'chai';
import { parseEffml } from '../dist/parser.js';
import { sampleDocumnet } from './sample.js';
import { effmlStringify } from '../dist/stringify.js';

const sampleInput = await fs.readFile('./test/sample.effml', 'utf-8');
const sampleInputMin = await fs.readFile('./test/sample.min.effml', 'utf-8');

describe('Effml stringify', () => {
  it('should stringify empty input', () => {
    const input = '';
    const result = parseEffml(input);

    expect(result).to.deep.equal({
      attributes: {},
      nodes: [],
    });
  });

  it('should stringify Effml content with elements and attributes', () => {
    const result = effmlStringify(sampleDocumnet);
    expect(result).to.deep.equal(sampleInput);
  });

  it('should stringify and minify Effml content with elements and attributes', () => {
    const result = effmlStringify(sampleDocumnet, 'minify');
    expect(result).to.deep.equal(sampleInputMin);
  });
});
