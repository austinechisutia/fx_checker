import { useCurrency } from '../../context/CurrencyContext';
import { usePinned } from '../../context/PinnedContext';
import CurrencyFlag from '../CurrencyFlag/CurrencyFlag';
import styles from './Compare.module.css';

export default function Compare() {
  const { base, sendAmount, rates, currencies, loading } = useCurrency();
  const { isPinned, togglePin } = usePinned();

  const pairs = Object.keys(rates)
    .filter((code) => code !== base)
    .sort();

  if (!sendAmount) {
    return (
      <section className={styles.container} aria-label="Multi-currency comparison">
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Enter an amount to compare</p>
          <p className={styles.emptyHint}>
            Type a send amount in the converter above to see live comparisons across all currencies.
          </p>
        </div>
      </section>
    );
  }

  if (loading && pairs.length === 0) {
    return (
      <section className={styles.container} aria-label="Multi-currency comparison">
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Loading rates…</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container} aria-label="Multi-currency comparison">
      <div className={styles.header}>
        <span className={styles.headerLabel}>
          Multi-currency: {sendAmount.toLocaleString()} from {base}
        </span>
        <span className={styles.headerCount}>{pairs.length} pairs</span>
      </div>

      <ul className={styles.list}>
        {pairs.map((code) => {
          const rate = rates[code];
          const converted = sendAmount * rate;
          const pair = `${base}/${code}`;
          const pinned = isPinned(pair);

          return (
            <li key={code} className={styles.row}>
              <CurrencyFlag code={code} size={32} className={styles.flag} />
              <div className={styles.info}>
                <span className={styles.code}>{code}</span>
                <span className={styles.name}>{currencies[code]}</span>
              </div>
              <div className={styles.amounts}>
                <span className={styles.converted}>
                  {converted.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
                <span className={styles.rate}>
                  1 {base} = {rate.toFixed(4)} {code}
                </span>
              </div>
              <button
                className={`${styles.pinBtn} ${pinned ? styles.pinBtnActive : ''}`}
                type="button"
                aria-label={pinned ? `Unpin ${pair}` : `Pin ${pair}`}
                aria-pressed={pinned}
                onClick={() => togglePin(pair)}
              >
                <img
                  src={pinned ? '/assets/images/icon-star-filled.svg' : '/assets/images/icon-star.svg'}
                  alt=""
                  width={16}
                  height={16}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
