import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { fetchRateHistory } from '../../lib/api';
import { useCurrency } from '../../context/CurrencyContext';
import type { RangeKey, RatePoint } from '../../types';
import styles from './History.module.css';

const RANGES: RangeKey[] = ['1d', '1w', '1m', '3m', '1y', '5y'];

function formatXAxisDate(date: string, range: RangeKey): string {
  const d = new Date(date);
  if (range === '1d' || range === '1w') {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  if (range === '1m' || range === '3m') {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
}

function calcStats(data: RatePoint[]) {
  if (data.length < 2) return null;
  const open = data[0].rate;
  const last = data[data.length - 1].rate;
  const change = last - open;
  const changePct = (change / open) * 100;
  return { open, last, change, changePct };
}

export default function History() {
  const { base, quote } = useCurrency();
  const [range, setRange] = useState<RangeKey>('1m');
  const [data, setData] = useState<RatePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchRateHistory(base, quote, range)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [base, quote, range]);

  const stats = calcStats(data);
  const isPositive = stats ? stats.change >= 0 : true;
  const lastPoint = data[data.length - 1];

  const yValues = data.map((d) => d.rate);
  const yMin = yValues.length ? Math.min(...yValues) : 0;
  const yMax = yValues.length ? Math.max(...yValues) : 1;
  const yPad = (yMax - yMin) * 0.1 || 0.001;

  return (
    <section className={styles.container} aria-label="Rate history">

      {/* Stats row */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Open</span>
          <span className={styles.statValue}>
            {stats ? stats.open.toFixed(4) : '—'}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Last</span>
          <span className={styles.statValue}>
            {stats ? stats.last.toFixed(4) : '—'}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Change</span>
          <span className={`${styles.statValue} ${stats ? (isPositive ? styles.positive : styles.negative) : ''}`}>
            {stats ? (isPositive ? '+' : '') + stats.change.toFixed(4) : '—'}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>% Change</span>
          <span className={`${styles.statValue} ${stats ? (isPositive ? styles.positive : styles.negative) : ''}`}>
            {stats
              ? `${isPositive ? '▲' : '▼'} ${Math.abs(stats.changePct).toFixed(2)}%`
              : '—'}
          </span>
        </div>

        {/* Range selector */}
        <div className={styles.ranges} role="group" aria-label="Chart range">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              className={`${styles.rangeBtn} ${range === r ? styles.rangeBtnActive : ''}`}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Pair label */}
      <div className={styles.pairRow}>
        <span className={styles.pairLabel}>{base}/{quote}</span>
        {lastPoint && (
          <span className={styles.pairMeta}>
            {lastPoint.rate.toFixed(4)} · {new Date(lastPoint.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className={styles.chartWrap}>
        {error ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No chart data available</p>
            <p className={styles.emptyBody}>
              We couldn't load rate history for {base}/{quote} right now. This usually clears up in a minute.
            </p>
          </div>
        ) : loading ? (
          <div className={styles.loading} aria-live="polite">Loading…</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b8ff00" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#b8ff00" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2430"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(d) => formatXAxisDate(d, range)}
                tick={{ fill: '#5a6272', fontSize: 11, fontFamily: 'inherit' }}
                axisLine={false}
                tickLine={false}
                minTickGap={48}
              />

              <YAxis
                domain={[yMin - yPad, yMax + yPad]}
                tickFormatter={(v) => v.toFixed(4)}
                tick={{ fill: '#5a6272', fontSize: 11, fontFamily: 'inherit' }}
                axisLine={false}
                tickLine={false}
                width={60}
                tickCount={4}
              />

              <Tooltip
                contentStyle={{
                  background: '#13161b',
                  border: '1px solid #1f2430',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#5a6272', marginBottom: 4 }}
                formatter={(value) => [(Number(value)).toFixed(4), `${base}/${quote}`]}
              />

              <Area
                type="monotone"
                dataKey="rate"
                stroke="#b8ff00"
                strokeWidth={1.5}
                fill="url(#rateGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#b8ff00', stroke: '#0b0c0f', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
