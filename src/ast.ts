import { Visitor } from "./visitor.js";
import { parseEffml } from "./parser.js";
import { ParsingError } from "./errors.js";

export type Node = Element | Text;

export type Attributes = {
  [key: string]: string;
}

export interface Content {
  attrs: Attributes;
  nodes: Node[];
}

export interface Element extends Content {
  type: 'element';
  name: string;
}

export interface Text {
  type: 'text';
  value: string;
}

export interface EffmlDocument extends Content {}

type Attribute = {
  name: string;
  value: string;
}

export const astVisitor: Visitor<Attribute, Text, Element, EffmlDocument> = {
  attribute: (name: string, value: string): Attribute => ({ name, value }),
  text: (value: string) => ({ type: 'text', value }),
  element: (name: string, attrs, nodes) => ({
    type: 'element',
    name,
    attrs: attrs.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {} as Attributes),
    nodes,
  }),
  document: (attrs, nodes) => ({
    attrs: attrs.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {} as Attributes),
    nodes,
  }),
};

export const parseToAst = (input: string): EffmlDocument | ParsingError => {
  return parseEffml(input, astVisitor);
};
