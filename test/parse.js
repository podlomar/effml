import { promises as fs } from 'fs';
import { expect } from 'chai';
import { parseEffml } from '../dist/parser.js';
import { sampleDocumnet } from './sample.js';

const sampleInput = await fs.readFile('./test/sample.effml', 'utf-8');
const sampleInputMin = await fs.readFile('./test/sample.min.effml', 'utf-8');

describe('Effml Parser', () => {
  it('should handle empty input', () => {
    const input = '';
    const result = parseEffml(input);

    expect(result).to.deep.equal({
      attributes: {},
      nodes: [],
    });
  });

  it('should handle input with only whitespace characters', () => {
    const input = '      \t\n  ';

    const result = parseEffml(input);

    expect(result).to.deep.equal({
      attributes: {},
      nodes: [],
    });
  });

  it('should handle input with only text content', () => {
    const input = `'Hello, World!'`;

    const result = parseEffml(input);

    expect(result).to.deep.equal({
      attributes: {},
      nodes: [
        { type: 'text', value: 'Hello, World!' },
      ],
    });
  });

  it('should handle input with empty elements', () => {
    const input = 'element1 {} element2 {}';

    const result = parseEffml(input);

    expect(result).to.deep.equal({
      attributes: {},
      nodes: [
        { type: 'element', tagName: 'element1', attributes: {}, nodes: [] },
        { type: 'element', tagName: 'element2', attributes: {}, nodes: [] },
      ],
    });
  });

  it('should parse Effml content with nested elements', () => {
    const input = `div{p{span{'Hello'}}p{' World!'}}`;

    const result = parseEffml(input);

    expect(result).to.deep.equal({
      attributes: {},
      nodes: [
        {
          type: 'element',
          tagName: 'div',
          attributes: {},
          nodes: [
            {
              type: 'element',
              tagName: 'p',
              attributes: {},
              nodes: [
                {
                  type: 'element',
                  tagName: 'span',
                  attributes: {},
                  nodes: [
                    { type: 'text', value: 'Hello' },
                  ],
                },
              ],
            },
            {
              type: 'element',
              tagName: 'p',
              attributes: {},
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
    const result = parseEffml(sampleInput);
    expect(result).to.deep.equal(sampleDocumnet);
  });

  it('should parse minified Effml content with elements and attributes', () => {
    const result = parseEffml(sampleInputMin);
    expect(result).to.deep.equal(sampleDocumnet);
  });
});
