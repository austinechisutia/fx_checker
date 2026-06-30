import { useState } from 'react';
import { getFlagCode } from '../../lib/currencyFlags';
import styles from './CurrencyFlag.module.css';

interface Props {
  code: string;
  size: number;
  className?: string;
}

const PALETTE = [
  '#5B8DD9', '#9B6DD9', '#D96B8D', '#D97B2E',
  '#4DBD8A', '#D95B5B', '#2EAED9', '#8DD98D',
];

function bgColor(code: string): string {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) % PALETTE.length;
  return PALETTE[h];
}

export default function CurrencyFlag({ code, size, className = '' }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`${styles.fallback} ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.36), background: bgColor(code) }}
        aria-hidden="true"
      >
        {code.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={`/assets/images/flags/${getFlagCode(code)}.webp`}
      alt=""
      width={size}
      height={size}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
