import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchCurrencies, fetchLatestRates, fetchPreviousDayRates } from '../lib/api';
import type { Currencies } from '../types';

interface CurrencyContextValue {
  base: string;
  quote: string;
  sendAmount: number;
  rates: Record<string, number>;        // today's rates relative to `base`
  tickerRates: Record<string, number>;  // today's USD rates (for ticker)
  tickerPrevRates: Record<string, number>; // yesterday's USD rates (for 24h change)
  currencies: Currencies;
  ratesDate: string;
  loading: boolean;
  setBase: (c: string) => void;
  setQuote: (c: string) => void;
  setSendAmount: (n: number) => void;
  swapPair: () => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [base, setBaseState] = useState('USD');
  const [quote, setQuoteState] = useState('EUR');
  const [sendAmount, setSendAmount] = useState(1000);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [tickerRates, setTickerRates] = useState<Record<string, number>>({});
  const [tickerPrevRates, setTickerPrevRates] = useState<Record<string, number>>({});
  const [currencies, setCurrencies] = useState<Currencies>({});
  const [ratesDate, setRatesDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch currency list and ticker data once on mount
  useEffect(() => {
    Promise.all([
      fetchCurrencies(),
      fetchLatestRates('USD'),
      fetchPreviousDayRates('USD'),
    ]).then(([currencyMap, today, yesterday]) => {
      setCurrencies(currencyMap);
      setTickerRates(today.rates);
      setTickerPrevRates(yesterday.rates);
    });
  }, []);

  // Fetch converter rates whenever base changes
  useEffect(() => {
    setLoading(true);
    fetchLatestRates(base)
      .then((data) => {
        setRates(data.rates);
        setRatesDate(data.date);
      })
      .finally(() => setLoading(false));
  }, [base]);

  function setBase(c: string) {
    if (c === quote) setQuoteState(base);
    setBaseState(c);
  }

  function setQuote(c: string) {
    if (c === base) setBaseState(quote);
    setQuoteState(c);
  }

  function swapPair() {
    setBaseState(quote);
    setQuoteState(base);
  }

  return (
    <CurrencyContext.Provider
      value={{
        base, quote, sendAmount, rates, tickerRates, tickerPrevRates,
        currencies, ratesDate, loading,
        setBase, setQuote, setSendAmount, swapPair,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
