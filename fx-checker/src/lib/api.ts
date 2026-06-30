import type { Currencies, LatestRates, RatePoint, RangeKey } from '../types';

const API = 'https://api.frankfurter.dev/v2';

interface V2Rate {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

interface V2Currency {
  iso_code: string;
  name: string;
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getFromDate(range: RangeKey): string {
  const d = new Date();
  switch (range) {
    case '1d': d.setDate(d.getDate() - 7); break;   // ECB is EOD, 1d shows 7 days
    case '1w': d.setDate(d.getDate() - 7); break;
    case '1m': d.setMonth(d.getMonth() - 1); break;
    case '3m': d.setMonth(d.getMonth() - 3); break;
    case '1y': d.setFullYear(d.getFullYear() - 1); break;
    case '5y': d.setFullYear(d.getFullYear() - 5); break;
  }
  return toDateString(d);
}

function toRatesRecord(entries: V2Rate[]): Record<string, number> {
  return Object.fromEntries(entries.map((e) => [e.quote, e.rate]));
}

export async function fetchCurrencies(): Promise<Currencies> {
  const res = await fetch(`${API}/currencies`);
  if (!res.ok) throw new Error(`Failed to fetch currencies: ${res.status}`);
  const data: V2Currency[] = await res.json();
  return Object.fromEntries(data.map((c) => [c.iso_code, c.name]));
}

export async function fetchLatestRates(base: string): Promise<LatestRates> {
  const res = await fetch(`${API}/rates?base=${base}`);
  if (!res.ok) throw new Error(`Failed to fetch rates: ${res.status}`);
  const data: V2Rate[] = await res.json();
  return {
    base,
    date: data[0]?.date ?? '',
    rates: toRatesRecord(data),
  };
}

export async function fetchPreviousDayRates(base: string): Promise<LatestRates> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  // Fetch last 3 days so we always catch the most recent trading day
  const from = new Date();
  from.setDate(from.getDate() - 3);
  const res = await fetch(
    `${API}/rates?base=${base}&from=${toDateString(from)}&to=${toDateString(yesterday)}`
  );
  if (!res.ok) throw new Error(`Failed to fetch previous rates: ${res.status}`);
  const data: V2Rate[] = await res.json();
  // Group by date and take the latest date
  const latestDate = data.reduce((max, e) => (e.date > max ? e.date : max), '');
  const latestEntries = data.filter((e) => e.date === latestDate);
  return {
    base,
    date: latestDate,
    rates: toRatesRecord(latestEntries),
  };
}

export async function fetchRateHistory(
  base: string,
  symbol: string,
  range: RangeKey
): Promise<RatePoint[]> {
  const from = getFromDate(range);
  const to = toDateString(new Date());
  const res = await fetch(`${API}/rates?base=${base}&quotes=${symbol}&from=${from}&to=${to}`);
  if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
  const data: V2Rate[] = await res.json();
  return data
    .filter((e) => e.quote === symbol)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ date: e.date, rate: e.rate }));
}
