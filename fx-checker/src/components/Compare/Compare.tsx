import styles from './Compare.module.css';

export default function Compare() {
  return (
    <section className={styles.container} aria-label="Multi-currency comparison">
      {/* Header: send amount + base currency, pair count */}
      {/* Dynamic: one row per currency with flag, code, converted amount, rate, pin toggle */}
      {/* Empty state: prompt to enter an amount */}
    </section>
  );
}
