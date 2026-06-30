import styles from './Favourites.module.css';

export default function Favourites() {
  return (
    <section className={styles.container} aria-label="Pinned pairs">
      {/* Header: "Pinned pairs" + count */}
      {/* Dynamic: one row per pinned pair with pair name, live rate, 24h change, unpin button */}
      {/* Empty state: prompt to pin a pair */}
    </section>
  );
}
