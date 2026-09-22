// src/types/content.ts

export type ColorKey = "l1" | "l2" | "l3" | "l4" | "g";

// ---- loop.json ----------------------------------------------------------

export type LoopLayer = {
  id: string;
  number: number;
  name: string;
  description: string;
  transition: string;
  colorKey: ColorKey;
  position: "top-left" | "top-right" | "bottom-right" | "bottom-left";
};

export type LoopGate = {
  id: "gate";
  name: string;
  position: string;
  description: string;
  transition: string;
};

export type Loop = {
  title: string;
  standfirst: string;
  readOrder: string;
  note: string;
  layers: LoopLayer[];
  gate: LoopGate;
};

// ---- severity.json ------------------------------------------------------

export type Severity = {
  id: string;
  label: string;
  definition: string;
  response: string;
  rank: number;
  colorKey: ColorKey;
};

// ---- categories.json ----------------------------------------------------

export type Category = {
  id: string;
  label: string;
  description: string;
  owner: string;
};

// ---- metrics.json -------------------------------------------------------

export type Metric = {
  id: string;
  label: string;
  expanded: string;
  measures: string;
  pointsTo: string;
  colorKey: ColorKey;
};

// ---- glossary.json ------------------------------------------------------

export type GlossaryTerm = {
  term: string;
  definition: string;
};

// ---- fluency.json -------------------------------------------------------

export type FluencyItem = {
  id: string;
  title: string;
  body: string;
};

// ---- framings.json ------------------------------------------------------

export type Framing = {
  id: string;
  label: string;
  paragraphs: string[];
};
