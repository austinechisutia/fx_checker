import { CurrencyProvider } from './context/CurrencyContext';
import { PinnedProvider } from './context/PinnedContext';
import { LogProvider } from './context/LogContext';
import Header from './components/Header/Header';
import Converter from './components/Converter/Converter';
import Tabs from './components/Tabs/Tabs';
import styles from './App.module.css';

export default function App() {
  return (
    <CurrencyProvider>
      <PinnedProvider>
        <LogProvider>
          <Header />
          <main className={styles.main}>
            <div className={styles.container}>
              <Converter />
              <Tabs />
            </div>
          </main>
        </LogProvider>
      </PinnedProvider>
    </CurrencyProvider>
  );
}
