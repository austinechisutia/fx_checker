import { useCurrency } from '../../context/CurrencyContext';
import { usePinned } from '../../context/PinnedContext';
import styles from './Favourites.module.css';

function pairRate(
  base: string,
  quote: string,
  usdRates: Record<string, number>
): number {
  if (base === 'USD') return usdRates[quote] ?? 0;
  if (quote === 'USD') return usdRates[base] ? 1 / usdRates[base] : 0;
  const baseInUsd = usdRates[base];
  const quoteInUsd = usdRates[quote];
  if (!baseInUsd || !quoteInUsd) return 0;
  return quoteInUsd / baseInUsd;
}

export default function Favourites() {
  const { tickerRates, tickerPrevRates, setBase, setQuote } = useCurrency();
  const { pinned, togglePin } = usePinned();

  const pairs = [...pinned].map((key) => {
    const [base, quote] = key.split('/');
    return { key, base, quote };
  });

  if (pairs.length === 0) {
    return (
      <section className={styles.container} aria-label="Pinned pairs">
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No pinned pairs yet</p>
          <p className={styles.emptyHint}>
            Pin a pair from the Compare tab to track it here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container} aria-label="Pinned pairs">
      <div className={styles.header}>
        <span className={styles.headerLabel}>Pinned pairs</span>
        <span className={styles.headerCount}>{pairs.length} favorites</span>
      </div>

      <ul className={styles.list}>
        {pairs.map(({ key, base, quote }) => {
          const rate = pairRate(base, quote, tickerRates);
          const prevRate = pairRate(base, quote, tickerPrevRates);
          const hasChange = prevRate > 0 && rate > 0;
          const changePct = hasChange ? ((rate - prevRate) / prevRate) * 100 : null;
          const positive = changePct !== null && changePct >= 0;

          const displayRate = rate <= 0
            ? '—'
            : rate >= 100
            ? rate.toFixed(2)
            : rate >= 10
            ? rate.toFixed(3)
            : rate.toFixed(4);

          return (
            <li key={key} className={styles.rowWrap}>
              <button
                className={styles.row}
                type="button"
                aria-label={`Load ${base} to ${quote} into converter`}
                onClick={() => { setBase(base); setQuote(quote); }}
              >
                <span className={styles.pair}>
                  {base} <span className={styles.arrow}>→</span> {quote}
                </span>

                <span className={styles.rateGroup}>
                  <span className={styles.rate}>{displayRate}</span>
                  {changePct !== null ? (
                    <span className={`${styles.change} ${positive ? styles.positive : styles.negative}`}>
                      {positive ? '+' : ''}{changePct.toFixed(2)}%
                    </span>
                  ) : (
                    <span className={styles.changePlaceholder}>—</span>
                  )}
                </span>
              </button>

              <button
                className={styles.unpinBtn}
                type="button"
                aria-label={`Unpin ${key}`}
                onClick={() => togglePin(key)}
              >
                <img src="/assets/images/icon-star-filled.svg" alt="" width={16} height={16} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
