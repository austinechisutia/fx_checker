import { useEffect, useRef, useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import CurrencyFlag from '../CurrencyFlag/CurrencyFlag';
import styles from './CurrencyPicker.module.css';

const POPULAR = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'SGD'];

interface Props {
  isOpen: boolean;
  selectedCode: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

export default function CurrencyPicker({ isOpen, selectedCode, onSelect, onClose }: Props) {
  const { currencies } = useCurrency();
  const [query, setQuery] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
      setQuery('');
      setTimeout(() => searchRef.current?.focus(), 0);
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  const allCodes = Object.keys(currencies).sort();
  const popular = POPULAR.filter((c) => allCodes.includes(c));
  const others = allCodes.filter((c) => !POPULAR.includes(c));

  function matches(code: string): boolean {
    if (!query) return true;
    const q = query.toLowerCase();
    return code.toLowerCase().includes(q) || currencies[code]?.toLowerCase().includes(q);
  }

  const filteredPopular = popular.filter(matches);
  const filteredOthers = others.filter(matches);
  const noResults = filteredPopular.length === 0 && filteredOthers.length === 0;

  function handleSelect(code: string) {
    onSelect(code);
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClick={handleBackdropClick}
      onClose={onClose}
      aria-label="Select currency"
    >
      <div className={styles.panel}>
        <div className={styles.searchRow}>
          <img src="/assets/images/icon-search.svg" alt="" className={styles.searchIcon} />
          <input
            ref={searchRef}
            className={styles.searchInput}
            type="search"
            placeholder="Search currencies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search currencies"
          />
        </div>

        <div className={styles.list} role="listbox" aria-label="Currencies">
          {noResults ? (
            <p className={styles.noResults}>No currencies match "{query}"</p>
          ) : (
            <>
              {filteredPopular.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}>
                    <span>Popular</span>
                    <span className={styles.groupCount}>{filteredPopular.length}</span>
                  </div>
                  {filteredPopular.map((code) => (
                    <CurrencyRow
                      key={code}
                      code={code}
                      name={currencies[code] ?? ''}
                      isSelected={code === selectedCode}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}

              {filteredOthers.length > 0 && (
                <div className={styles.group}>
                  <div className={styles.groupHeader}>
                    <span>Other currencies</span>
                    <span className={styles.groupCount}>{filteredOthers.length}</span>
                  </div>
                  {filteredOthers.map((code) => (
                    <CurrencyRow
                      key={code}
                      code={code}
                      name={currencies[code] ?? ''}
                      isSelected={code === selectedCode}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}

interface RowProps {
  code: string;
  name: string;
  isSelected: boolean;
  onSelect: (code: string) => void;
}

function CurrencyRow({ code, name, isSelected, onSelect }: RowProps) {
  return (
    <button
      className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(code)}
    >
      <CurrencyFlag code={code} size={24} className={styles.flag} />
      <span className={styles.code}>{code}</span>
      <span className={styles.name}>{name}</span>
      {isSelected && (
        <img src="/assets/images/icon-check.svg" alt="" className={styles.check} />
      )}
    </button>
  );
}
