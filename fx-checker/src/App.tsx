import { CurrencyProvider } from './context/CurrencyContext';
import Header from './components/Header/Header';
import Converter from './components/Converter/Converter';
import Tabs from './components/Tabs/Tabs';
import styles from './App.module.css';

export default function App() {
  return (
    <CurrencyProvider>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Converter />
          <Tabs />
        </div>
      </main>
    </CurrencyProvider>
  );
}
