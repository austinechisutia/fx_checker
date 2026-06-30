import { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLog } from '../../context/LogContext';
import CurrencyPicker from '../CurrencyPicker/CurrencyPicker';
import { getFlagCode } from '../../lib/currencyFlags';
import styles from './Converter.module.css';

type PickerSlot = 'base' | 'quote' | null;

function FlagImg({ code }: { code: string }) {
  return (
    <img
      src={`/assets/images/flags/${getFlagCode(code)}.webp`}
      alt=""
      width={20}
      height={20}
      className={styles.flag}
      onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
    />
  );
}

export default function Converter() {
  const {
    base, quote, sendAmount, rates, ratesDate, loading,
    setBase, setQuote, setSendAmount, swapPair,
  } = useCurrency();

  const [pickerSlot, setPickerSlot] = useState<PickerSlot>(null);

  const { addEntry } = useLog();
  const rate = rates[quote] ?? 0;
  const receiveAmount = sendAmount * rate;

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

      <div className={styles.inputs}>
        {/* Send */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="send-amount">Send</label>
          <div className={styles.inputRow}>
            <input
              id="send-amount"
              className={styles.amount}
              type="number"
              value={sendAmount}
              min={0}
              onChange={(e) => setSendAmount(Number(e.target.value))}
            />
            <button
              className={styles.currencyBtn}
              type="button"
              aria-label={`Send currency: ${base}. Change currency`}
              onClick={() => setPickerSlot('base')}
            >
              <FlagImg code={base} />
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
          <img src="/assets/images/icon-exchange-vertical.svg" alt="" />
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
              <FlagImg code={quote} />
              <span>{quote}</span>
              <img src="/assets/images/icon-chevron-down.svg" alt="" />
            </button>
          </div>
        </div>
      </div>

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

      <CurrencyPicker
        isOpen={pickerSlot !== null}
        selectedCode={pickerSlot === 'base' ? base : quote}
        onSelect={handlePickerSelect}
        onClose={() => setPickerSlot(null)}
      />
    </section>
  );
}
