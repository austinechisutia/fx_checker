import { useState } from 'react';
import styles from './Tabs.module.css';
import History from '../History/History';
import Compare from '../Compare/Compare';
import Favourites from '../Favourites/Favourites';
import Log from '../Log/Log';

type TabId = 'history' | 'compare' | 'favourites' | 'log';

const TABS: { id: TabId; label: string; badge?: number }[] = [
  { id: 'history', label: 'History' },
  { id: 'compare', label: 'Compare' },
  { id: 'favourites', label: 'Favorites', badge: 0 },
  { id: 'log', label: 'Log', badge: 0 },
];

export default function Tabs() {
  const [active, setActive] = useState<TabId>('history');

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabList} role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`${styles.tab} ${active === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActive(tab.id)}
            type="button"
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={styles.badge}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div
        id={`panel-history`}
        role="tabpanel"
        aria-labelledby="tab-history"
        hidden={active !== 'history'}
      >
        <History />
      </div>
      <div
        id={`panel-compare`}
        role="tabpanel"
        aria-labelledby="tab-compare"
        hidden={active !== 'compare'}
      >
        <Compare />
      </div>
      <div
        id={`panel-favourites`}
        role="tabpanel"
        aria-labelledby="tab-favourites"
        hidden={active !== 'favourites'}
      >
        <Favourites />
      </div>
      <div
        id={`panel-log`}
        role="tabpanel"
        aria-labelledby="tab-log"
        hidden={active !== 'log'}
      >
        <Log />
      </div>
    </div>
  );
}
