import { tokenize, TokenType, Token } from "./lexer.js";
import { isParsingError, ParsingError, errors } from "./errors.js";
import { Visitor } from "./visitor.js";

const parseContent = <A, T, E, D>(
  tokens: Generator<Token | ParsingError>,
  visitor: Visitor<A, T, E, D>,
  level: number,
): [A[], (T | E)[]] | ParsingError => {
  const nodes: (T | E)[] = [];
  const attributes: A[] = [];
  
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
        attributes.push(visitor.attribute(token.value, nextToken.value, level + 1));
      } else if (nextToken.type === TokenType.OpenBrace) {
        const result = parseContent(tokens, visitor, level + 1);
        if (isParsingError(result)) {
          return result;
        }
        const [attrs, children] = result;
        nodes.push(visitor.element(token.value, attrs, children, level + 1));
      } else {
        return errors.unexpectedToken(nextToken.line, nextToken.column, nextToken.value);
      }
    } else if (token.type === TokenType.Text) {
      nodes.push(visitor.text(token.value, level));
    } else if (token.type === TokenType.CloseBrace) {
      return [attributes, nodes];
    } else {
      return errors.unexpectedToken(token.line, token.column, token.value);
    }

    current = tokens.next();
  }

  return [attributes, nodes];
};

export const parseEffml = <A, T, E, D>(
  input: string, visitor: Visitor<A, T, E, D
>): D | ParsingError => {
  const tokenized = tokenize(input);
  const result = parseContent(tokenized, visitor, 0);

  if (isParsingError(result)) {
    return result;
  }

  const [attrs, nodes] = result;
  return visitor.document(attrs, nodes);
}
