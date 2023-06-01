import { promises as fs } from 'fs';
import { expect } from 'chai';
import { sampleDocumnet } from './assets/small.js';
import { effmlStringify } from '../dist/stringify.js';

const sampleOutput = await fs.readFile('./test/assets/small.effml', 'utf-8');
const sampleOutputMin = await fs.readFile('./test/assets/small.min.effml', 'utf-8');

describe('Effml stringify', () => {
  it('should stringify empty input', () => {
    const input = { attrs: {}, nodes: []};
    const result = effmlStringify(input);

    expect(result).to.deep.equal('');
  });

  it('should stringify Effml content with elements and attributes', () => {
    const result = effmlStringify(sampleDocumnet);
    expect(result).to.deep.equal(sampleOutput);
  });

  it('should stringify and minify Effml content with elements and attributes', () => {
    const result = effmlStringify(sampleDocumnet, 'minify');
    expect(result).to.deep.equal(sampleOutputMin);
  });
});
