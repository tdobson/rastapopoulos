// ../types/bomCalculator.ts

export type CellTypesCount = {
  SinglePanel: number;
  MidPanel: number;
  EndPanel: number;
  MiddleMidPanel: number;
  MiddleEndPanel: number;
  TopMidPanel: number;
  TopEndPanel: number;
  TopSinglePanel: number;
  BottomMidPanel: number;
  BottomEndPanel: number;
  BottomSinglePanel: number;
  CenterSinglePanel: number;
  CenterBottomPanel: number;
  CenterMidPanel: number;
  CenterTopPanel: number;
  EmptyCell: number;
  Error: number;
};

export type PanelPrices = {
  [key: string]: number;
};

export type ComponentPrices = {
  [key: string]: number;
};

export type BOMItem = {
  quantity: number;
  price: number;
  total: number;
  explanation: string;
};

export type BOM = {
  [key: string]: BOMItem;
};
export type BOMWithExplanations = {
  [key: string]: BOMItem;
};
