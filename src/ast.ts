export type Node = ElementNode | TextNode;

export type Attributes = {
  [key: string]: string;
}

export interface ElementNode {
  type: 'element';
  tagName: string;
  attributes: Attributes;
  nodes: Node[];
}

export interface TextNode {
  type: 'text';
  value: string;
}

export interface EffmlDocument {
  attributes: Attributes;
  nodes: Node[];
}
