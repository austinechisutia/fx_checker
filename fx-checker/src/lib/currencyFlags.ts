const CURRENCY_FLAG_MAP: Record<string, string> = {
  // A
  AED: 'ae', AFN: 'af', ALL: 'al', AMD: 'am', ANG: 'cw', AOA: 'ao',
  ARS: 'ar', AUD: 'au', AWG: 'aw', AZN: 'az',
  // B
  BAM: 'ba', BBD: 'bb', BDT: 'bd', BGN: 'bg', BHD: 'bh', BIF: 'bi',
  BMD: 'bm', BND: 'bn', BOB: 'bo', BRL: 'br', BSD: 'bs', BTN: 'bt',
  BWP: 'bw', BYN: 'by', BZD: 'bz',
  // C
  CAD: 'ca', CDF: 'cd', CHF: 'ch', CLP: 'cl', CNH: 'cn', CNY: 'cn',
  COP: 'co', CRC: 'cr', CUP: 'cu', CVE: 'cv', CZK: 'cz',
  // D
  DJF: 'dj', DKK: 'dk', DOP: 'do', DZD: 'dz',
  // E
  EGP: 'eg', ERN: 'er', ETB: 'et', EUR: 'eu',
  // F
  FJD: 'fj', FKP: 'fk',
  // G
  GBP: 'gb', GEL: 'ge', GGP: 'gg', GHS: 'gh', GIP: 'gi', GMD: 'gm',
  GNF: 'gn', GTQ: 'gt', GYD: 'gy',
  // H
  HKD: 'hk', HNL: 'hn', HRK: 'hr', HTG: 'ht', HUF: 'hu',
  // I
  IDR: 'id', ILS: 'il', IMP: 'im', INR: 'in', IQD: 'iq', IRR: 'ir',
  ISK: 'is',
  // J
  JEP: 'je', JMD: 'jm', JOD: 'jo', JPY: 'jp',
  // K
  KES: 'ke', KGS: 'kg', KHR: 'kh', KMF: 'km', KPW: 'kp', KRW: 'kr',
  KWD: 'kw', KYD: 'ky', KZT: 'kz',
  // L
  LAK: 'la', LBP: 'lb', LKR: 'lk', LRD: 'lr', LSL: 'ls', LYD: 'ly',
  // M
  MAD: 'ma', MDL: 'md', MGA: 'mg', MKD: 'mk', MMK: 'mm', MNT: 'mn',
  MOP: 'mo', MRO: 'mr', MRU: 'mr', MUR: 'mu', MVR: 'mv', MWK: 'mw',
  MXN: 'mx', MYR: 'my', MZN: 'mz',
  // N
  NAD: 'na', NGN: 'ng', NIO: 'ni', NOK: 'no', NPR: 'np', NZD: 'nz',
  // O
  OMR: 'om',
  // P
  PAB: 'pa', PEN: 'pe', PGK: 'pg', PHP: 'ph', PKR: 'pk', PLN: 'pl',
  PYG: 'py',
  // Q
  QAR: 'qa',
  // R
  RON: 'ro', RSD: 'rs', RUB: 'ru', RWF: 'rw',
  // S
  SAR: 'sa', SBD: 'sb', SCR: 'sc', SDG: 'sd', SEK: 'se', SGD: 'sg',
  SHP: 'sh', SLE: 'sl', SOS: 'so', SRD: 'sr', SSP: 'ss', STN: 'st',
  SVC: 'sv', SYP: 'sy', SZL: 'sz',
  // T
  THB: 'th', TJS: 'tj', TMT: 'tm', TND: 'tn', TOP: 'to', TRY: 'tr',
  TTD: 'tt', TWD: 'tw', TZS: 'tz',
  // U
  UAH: 'ua', UGX: 'ug', USD: 'us', UYU: 'uy', UZS: 'uz',
  // V
  VES: 've', VND: 'vn', VUV: 'vu',
  // W
  WST: 'ws',
  // X
  XCD: 'lc', XPF: 'pf',
  // Y
  YER: 'ye',
  // Z
  ZAR: 'za', ZMW: 'zm', ZWG: 'zw',
};

export function getFlagCode(currencyCode: string): string {
  return CURRENCY_FLAG_MAP[currencyCode.toUpperCase()] ?? currencyCode.toLowerCase();
}
