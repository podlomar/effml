export interface Visitor<A, T, E, D> {
  attribute: (name: string, value: string, level: number) => A;
  text: (text: string, level: number) => T;
  element: (name: string, attrs: A[], nodes: (T | E)[], level: number) => E;
  document: (attrs: A[], nodes: (T | E)[]) => D;
}
