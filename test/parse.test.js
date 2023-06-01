import { promises as fs } from 'fs';
import { expect } from 'chai';
import { parseToAst } from '../dist/index.js';
import { sampleDocumnet } from './assets/small.js';

const sampleInput = await fs.readFile('./test/assets/small.effml', 'utf-8');
const sampleInputMin = await fs.readFile('./test/assets/small.min.effml', 'utf-8');

describe('Effml Parser', () => {
  it('should handle empty input', () => {
    const input = '';
    const result = parseToAst(input);

    expect(result).to.deep.equal({
      attrs: {},
      nodes: [],
    });
  });

  it('should handle input with only whitespace characters', () => {
    const input = '      \t\n  ';

    const result = parseToAst(input);

    expect(result).to.deep.equal({
      attrs: {},
      nodes: [],
    });
  });

  it('should handle input with only text content', () => {
    const input = `'Hello, World!'`;

    const result = parseToAst(input);

    expect(result).to.deep.equal({
      attrs: {},
      nodes: [
        { type: 'text', value: 'Hello, World!' },
      ],
    });
  });

  it('should handle input with empty elements', () => {
    const input = 'element1 {} element2 {}';

    const result = parseToAst(input);

    expect(result).to.deep.equal({
      attrs: {},
      nodes: [
        { type: 'element', name: 'element1', attrs: {}, nodes: [] },
        { type: 'element', name: 'element2', attrs: {}, nodes: [] },
      ],
    });
  });

  it('should parse Effml content with nested elements', () => {
    const input = `div{p{span{'Hello'}}p{' World!'}}`;

    const result = parseToAst(input);

    expect(result).to.deep.equal({
      attrs: {},
      nodes: [
        {
          type: 'element',
          name: 'div',
          attrs: {},
          nodes: [
            {
              type: 'element',
              name: 'p',
              attrs: {},
              nodes: [
                {
                  type: 'element',
                  name: 'span',
                  attrs: {},
                  nodes: [
                    { type: 'text', value: 'Hello' },
                  ],
                },
              ],
            },
            {
              type: 'element',
              name: 'p',
              attrs: {},
              nodes: [
                { type: 'text', value: ' World!' },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should parse Effml content with elements and attributes', () => {
    const result = parseToAst(sampleInput);
    expect(result).to.deep.equal(sampleDocumnet);
  });

  it('should parse minified Effml content with elements and attributes', () => {
    const result = parseToAst(sampleInputMin);
    expect(result).to.deep.equal(sampleDocumnet);
  });
});
