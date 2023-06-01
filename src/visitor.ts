export interface Visitor<A, T, E, D> {
  attribute: (name: string, value: string) => A;
  text: (text: string) => T;
  element: (name: string, attributes: A[], nodes: (T | E)[]) => E;
  document: (attributes: A[], nodes: (T | E)[]) => D;
}
