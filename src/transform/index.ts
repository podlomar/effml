import { Attributes, EffmlDocument, Node } from "../ast.js";
import { Visitor } from "../visitor.js";

export const transformAttrs = <A, T, E, D>(
  attrs: Attributes,
  level: number,
  visitor: Visitor<A, T, E, D>,
): A[] => Object.entries(attrs).map(([name, value]) =>
  visitor.attribute(name, value, level)
);

export const transformNode = <A, T, E, D>(
  node: Node,
  level: number,
  visitor: Visitor<A, T, E, D>,
): T | E => {
  if (node.type === "text") {
    return visitor.text(node.value, level);
  }

  const attrs = transformAttrs(node.attrs, level, visitor);
  const nodes = node.nodes.map((node) => transformNode(node, level + 1, visitor));
  return visitor.element(node.name, attrs, nodes, level);
};
  
export const transformDocument = <A, T, E, D>(
  document: EffmlDocument,
  visitor: Visitor<A, T, E, D>,
): D => {
  const attrs = transformAttrs(document.attrs, 0, visitor);
  const nodes = document.nodes.map((node) => transformNode(node, 0, visitor));
  return visitor.document(attrs, nodes);
};
