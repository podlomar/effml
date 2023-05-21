import { Attributes, EffmlDocument, ElementNode, Node } from "./ast";

export const parseContent = (input: string): [Attributes, Node[], number] => {
  const nodes: Node[] = [];
  const attributes: Attributes = {};
  let currentText = '';
  let i = 0;
  
  while(i < input.length) {
    const char = input[i];
    
    if (char === '\'') {
      const quoteEnd = input.indexOf('\'', i + 1);
      const value = input.slice(i + 1, quoteEnd);

      if (currentText.length === 0) {  
        nodes.push({ type: 'text', value });
      } else {
        attributes[currentText] = value;
        currentText = '';
      }

      i = quoteEnd + 1;
    } else if (char === '{') {
      const [attrs, children, end] = parseContent(input.slice(i + 1));
      const element: ElementNode = { 
        type: 'element',
        tagName: currentText.trim(),
        attributes: attrs,
        nodes: children,
      };
    
      nodes.push(element);
      currentText = '';
      i += end + 1;
    } else if (char === '}') {
      return [attributes, nodes, i + 1];
    } else if (!/\s/.test(char)) {
      currentText += char;
      i++;
    } else {
      i++;
    }
  }

  return [attributes, nodes, i];
};

export const parseEffml = (input: string): EffmlDocument => {
  const [attributes, nodes] = parseContent(input);
  return { attributes, nodes };
}
