import { useCurrency } from '../../context/CurrencyContext';
import LiveRates from '../LiveRates/LiveRates';
import styles from './Header.module.css';

export default function Header() {
  const { currencies } = useCurrency();
  const currencyCount = Object.keys(currencies).length;

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <img src="/assets/images/logo.svg" alt="FX Checker" className={styles.logo} />
        <span className={styles.meta}>
          {currencyCount > 0 ? currencyCount : '—'} Currencies · EOD · ECB data
        </span>
      </div>
      <LiveRates />
    </header>
  );
}
