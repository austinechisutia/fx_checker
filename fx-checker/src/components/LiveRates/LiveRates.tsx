import { useCurrency } from '../../context/CurrencyContext';
import styles from './LiveRates.module.css';

const TICKER_PAIRS = ['EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'HKD', 'SGD', 'NZD', 'KRW', 'INR', 'MXN', 'BRL', 'ZAR'];

interface TickerItemProps {
  code: string;
  rate: number;
  prevRate: number;
}

function TickerItem({ code, rate, prevRate }: TickerItemProps) {
  const change = prevRate ? ((rate - prevRate) / prevRate) * 100 : 0;
  const isUp = change >= 0;

  return (
    <span className={styles.item}>
      <span className={styles.pair}>USD/{code}</span>
      <span className={styles.rate}>{rate.toFixed(4)}</span>
      <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
        {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </span>
    </span>
  );
}

export default function LiveRates() {
  const { tickerRates, tickerPrevRates } = useCurrency();

  const pairs = TICKER_PAIRS.filter((c) => tickerRates[c] !== undefined);

  if (pairs.length === 0) return null;

  // Duplicate pairs for seamless infinite scroll
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
