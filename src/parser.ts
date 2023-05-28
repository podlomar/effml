import { tokenize, TokenType, Token } from "./lexer.js";
import { Attributes, EffmlDocument, ElementNode, Node } from "./ast.js";
import { isParsingError, ParsingError, errors } from "./errors.js";

export const parseContent = (
  tokens: Generator<Token | ParsingError>
): [Attributes, Node[]] | ParsingError => {
  const nodes: Node[] = [];
  const attributes: Attributes = {};
  
  let current = tokens.next();
  while(!current.done) {
    const token = current.value;
    if (isParsingError(token)) {
      return token;
    }

    if (token.type === TokenType.Name) {
      const next = tokens.next();

      if (next.done) {
        return errors.unexpectedEof(token.line, token.column);
      }

      const nextToken = next.value;
      if (isParsingError(nextToken)) {
        return nextToken;
      }
      
      if (nextToken.type === TokenType.Text) {
        attributes[token.value] = nextToken.value;
      } else if (nextToken.type === TokenType.OpenBrace) {
        const result = parseContent(tokens);
        if (isParsingError(result)) {
          return result;
        }
        const [attrs, children] = result;
        const element: ElementNode = {
          type: 'element',
          tagName: token.value,
          attributes: attrs,
          nodes: children,
        };
        nodes.push(element);
      } else {
        return errors.unexpectedToken(nextToken.line, nextToken.column, nextToken.value);
      }
    } else if (token.type === TokenType.Text) {
      nodes.push({ type: 'text', value: token.value });
    } else if (token.type === TokenType.CloseBrace) {
      return [attributes, nodes];
    } else {
      return errors.unexpectedToken(token.line, token.column, token.value);
    }

    current = tokens.next();
  }

  return [attributes, nodes];
};

export const parseEffml = (input: string): EffmlDocument | ParsingError => {
  const tokenized = tokenize(input);
  const result = parseContent(tokenized);

  if (isParsingError(result)) {
    return result;
  }

  const [attributes, nodes] = result;
  return { attributes, nodes };
}
