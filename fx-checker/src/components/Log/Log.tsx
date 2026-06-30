import { useLog } from '../../context/LogContext';
import styles from './Log.module.css';

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  return new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatAmount(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export default function Log() {
  const { entries, deleteEntry, clearAll } = useLog();

  if (entries.length === 0) {
    return (
      <section className={styles.container} aria-label="Conversion log">
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No conversions logged yet</p>
          <p className={styles.emptyHint}>
            Hit "Log conversion" after a conversion to record it here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container} aria-label="Conversion log">
      <div className={styles.header}>
        <span className={styles.headerLabel}>
          Conversion log · {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
        <button className={styles.clearBtn} type="button" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.rowWrap}>
            <div className={styles.row}>
              <div className={styles.meta}>
                <span className={styles.time}>{relativeTime(entry.timestamp)}</span>
                <span className={styles.pair}>
                  {entry.base} <span className={styles.arrow}>→</span> {entry.quote}
                </span>
              </div>
              <div className={styles.amounts}>
                <span className={styles.send}>
                  {formatAmount(entry.sendAmount)} {entry.base}
                </span>
                <span className={styles.receive}>
                  {formatAmount(entry.receiveAmount)} {entry.quote}
                </span>
              </div>
            </div>
            <button
              className={styles.deleteBtn}
              type="button"
              aria-label={`Delete log entry for ${entry.base}/${entry.quote}`}
              onClick={() => deleteEntry(entry.id)}
            >
              <img src="/assets/images/icon-delete.svg" alt="" width={16} height={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
