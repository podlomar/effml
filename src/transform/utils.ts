export const indent = (value: string, level: number): string => '  '.repeat(level) + value;

export type PrintType = 'pretty' | 'minified';
