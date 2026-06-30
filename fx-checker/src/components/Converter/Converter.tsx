import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLog } from '../../context/LogContext';
import CurrencyPicker from '../CurrencyPicker/CurrencyPicker';
import CurrencyFlag from '../CurrencyFlag/CurrencyFlag';
import styles from './Converter.module.css';

type PickerSlot = 'base' | 'quote' | null;

function formatWithCommas(n: number) {
  return n > 0 ? n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';
}

export default function Converter() {
  const {
    base, quote, sendAmount, rates, ratesDate, loading,
    setBase, setQuote, setSendAmount, swapPair,
  } = useCurrency();

  const [pickerSlot, setPickerSlot] = useState<PickerSlot>(null);
  const [displaySend, setDisplaySend] = useState<string>(formatWithCommas(sendAmount));
  const isTyping = useRef(false);

  // Sync display when sendAmount changes externally (e.g. swap, context load)
  useEffect(() => {
    if (!isTyping.current) {
      setDisplaySend(formatWithCommas(sendAmount));
    }
  }, [sendAmount]);

  const { addEntry } = useLog();
  const rate = rates[quote] ?? 0;
  const receiveAmount = sendAmount * rate;

  function handleSendFocus() {
    isTyping.current = true;
  }

  function handleSendChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/,/g, '');
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
      setSendAmount(raw === '' ? 0 : Number(raw));
      setDisplaySend(e.target.value.replace(/[^0-9.,]/g, ''));
    }
  }

  function handleSendBlur() {
    isTyping.current = false;
    setDisplaySend(formatWithCommas(sendAmount));
  }

  function handleLogConversion() {
    if (!sendAmount || !rate) return;
    addEntry({ base, quote, sendAmount, receiveAmount, rate });
  }

  function handlePickerSelect(code: string) {
    if (pickerSlot === 'base') setBase(code);
    if (pickerSlot === 'quote') setQuote(code);
  }

  return (
    <section className={styles.converter} aria-label="Currency converter">
      <h1 className={styles.heading}>Check the rate</h1>

      <div className={styles.card}>
      <div className={styles.inputs}>
        {/* Send */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="send-amount">Send</label>
          <div className={styles.inputRow}>
            <input
              id="send-amount"
              className={styles.amount}
              type="text"
              inputMode="decimal"
              value={displaySend}
              onFocus={handleSendFocus}
              onChange={handleSendChange}
              onBlur={handleSendBlur}
            />
            <button
              className={styles.currencyBtn}
              type="button"
              aria-label={`Send currency: ${base}. Change currency`}
              onClick={() => setPickerSlot('base')}
            >
              <CurrencyFlag code={base} size={20} />
              <span>{base}</span>
              <img src="/assets/images/icon-chevron-down.svg" alt="" />
            </button>
          </div>
        </div>

        {/* Swap */}
        <button
          className={styles.swapBtn}
          type="button"
          aria-label="Swap currencies"
          onClick={swapPair}
        >
          <img src="/assets/images/icon-exchange.svg" alt="" />
        </button>

        {/* Receive */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="receive-amount">Receive</label>
          <div className={styles.inputRow}>
            <output id="receive-amount" className={styles.convertedAmount}>
              {loading ? '—' : receiveAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </output>
            <button
              className={styles.currencyBtn}
              type="button"
              aria-label={`Receive currency: ${quote}. Change currency`}
              onClick={() => setPickerSlot('quote')}
            >
              <CurrencyFlag code={quote} size={20} />
              <span>{quote}</span>
              <img src="/assets/images/icon-chevron-down.svg" alt="" />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.rateRow}>
        <p className={styles.rate}>
          {loading
            ? 'Fetching rate…'
            : `1 ${base} = ${rate.toFixed(4)} ${quote}${ratesDate ? ` · ${ratesDate}` : ''}`}
        </p>

        <div className={styles.actions}>
          <button className={styles.favouriteBtn} type="button">
            <img src="/assets/images/icon-star.svg" alt="" />
            Favorite
          </button>
          <button className={styles.logBtn} type="button" onClick={handleLogConversion}>
            Log conversion
          </button>
        </div>
      </div>

      </div>

      <CurrencyPicker
        isOpen={pickerSlot !== null}
        selectedCode={pickerSlot === 'base' ? base : quote}
        onSelect={handlePickerSelect}
        onClose={() => setPickerSlot(null)}
      />
    </section>
  );
}
