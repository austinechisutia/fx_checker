import styles from './Log.module.css';

export default function Log() {
  return (
    <section className={styles.container} aria-label="Conversion log">
      {/* Header: "Conversion log" + count + "Clear all" button */}
      {/* Dynamic: one row per logged conversion with time, pair, send/receive amounts, delete button */}
      {/* Empty state: prompt explaining conversions are recorded automatically */}
    </section>
  );
}
