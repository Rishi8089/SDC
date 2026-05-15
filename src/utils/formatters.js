/**
 * Shared formatting helpers.
 * These are extracted from App.jsx so other components can reuse them.
 * The implementations are identical to the originals in App.jsx.
 */

/**
 * Format a number as Indian currency string.
 * @param {number} n
 * @returns {string}  e.g. "₹1,23,456"
 */
export const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

/**
 * Format a rate as a percentage string, trimming trailing zeros.
 * @param {number|null} r
 * @returns {string}  e.g. "3.5%" or "—"
 */
export const pct = (r) => {
  if (r == null) return '—';
  let s = parseFloat(r).toFixed(4);
  while (s.endsWith('0')) s = s.slice(0, -1);
  if (s.endsWith('.')) s = s.slice(0, -1);
  return s + '%';
};
