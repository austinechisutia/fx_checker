export interface RatePoint {
  date: string;
  rate: number;
}

export interface LatestRates {
  base: string;
  rates: Record<string, number>;
  date: string;
}

export type RangeKey = '1d' | '1w' | '1m' | '3m' | '1y' | '5y';

export type Currencies = Record<string, string>;
