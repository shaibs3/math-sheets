export type Level = 1 | 2 | 3;

export type WorkStyle = "none" | "lines" | "vertical" | "box";

export type Problem = {
  prompt: string;
  answer: string;
  work?: WorkStyle;
  dir?: "rtl" | "ltr";
};

export type GeneratorOptions = {
  seed: number;
  count: number;
  level: Level;
};

export type Generator = {
  id: string;
  columns: 1 | 2 | 3 | 4;
  defaultCount: number;
  generate: (options: GeneratorOptions) => Problem[];
};

export type Topic = {
  id: string;
  name: string;
  strand: string;
  description: string;
  generatorId: string;
};

export type Grade = {
  id: number;
  name: string;
  available: boolean;
  topics: Topic[];
};
