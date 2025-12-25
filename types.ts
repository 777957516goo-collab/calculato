
export interface CalculationHistory {
  expression: string;
  result: string;
  timestamp: Date;
}

export enum Mode {
  STANDARD = 'STANDARD',
  SCIENTIFIC = 'SCIENTIFIC',
  AI = 'AI'
}
