import { useCurrency } from '../../context/CurrencyContext';
import styles from './LiveRates.module.css';

const TICKER_CODES = [
  'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'HKD',
  'SGD', 'NZD', 'KRW', 'INR', 'MXN', 'BRL', 'ZAR', 'TRY', 'SEK', 'PLN',
];

interface TickerItemProps {
  code: string;
  rate: number;
  prevRate: number;
}

function TickerItem({ code, rate, prevRate }: TickerItemProps) {
  const change = prevRate > 0 ? ((rate - prevRate) / prevRate) * 100 : null;
  const isUp = change !== null && change >= 0;

  return (
    <span className={styles.item}>
      <span className={styles.pair}>USD/{code}</span>
      <span className={styles.rate}>{rate.toFixed(4)}</span>
      {change !== null ? (
        <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
          {isUp ? '▲' : '▼'} {change > 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      ) : (
        <span className={styles.changeMuted}>—</span>
      )}
    </span>
  );
}

export default function LiveRates() {
  const { tickerRates, tickerPrevRates } = useCurrency();

  const pairs = TICKER_CODES.filter((c) => tickerRates[c] !== undefined);

  if (pairs.length === 0) {
    return (
      <section className={styles.ticker} aria-label="Live markets ticker">
        <span className={styles.label} aria-hidden="true">Live markets</span>
        <div className={styles.skeleton} aria-hidden="true" />
      </section>
    );
  }

  const items = [...pairs, ...pairs];

  return (
    <section className={styles.ticker} aria-label="Live markets ticker">
      <span className={styles.label} aria-hidden="true">Live markets</span>
      <div className={styles.trackWrapper} aria-hidden="true">
        <div className={styles.track}>
          {items.map((code, i) => (
            <TickerItem
              key={`${code}-${i}`}
              code={code}
              rate={tickerRates[code]}
              prevRate={tickerPrevRates[code] ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
