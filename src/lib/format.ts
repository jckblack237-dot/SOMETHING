/** Format a value in Maldivian Rufiyaa, e.g. "MVR 1,240". */
export function mvr(value: number, compact = false): string {
  if (compact && value >= 10000) {
    return `MVR ${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `MVR ${Math.round(value).toLocaleString('en-US')}`;
}

/** Bare number with thousands separators. */
export function num(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

export function pct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function signedPct(value: number, digits = 1): string {
  return `${value >= 0 ? '+' : '−'}${Math.abs(value).toFixed(digits)}%`;
}
