/**
 * Safe number handling utilities
 * Mengatasi floating point precision dan rounding errors
 */

/**
 * Convert to safe integer
 * Memastikan tidak ada floating point error
 */
export function toSafeInt(value: unknown): number {
  let num = Number(value);
  if (isNaN(num)) return 0;
  // Bulatkan ke bilangan bulat terdekat untuk menghindari floating point error
  return Math.round(num);
}

/**
 * Validate amount adalah bilangan bulat positif
 */
export function isValidAmount(amount: unknown): boolean {
  const num = toSafeInt(amount);
  return num > 0 && Number.isInteger(num);
}

/**
 * Safe addition menghindari floating point error
 */
export function safeAdd(a: number, b: number): number {
  return toSafeInt(a) + toSafeInt(b);
}

/**
 * Safe subtraction menghindari floating point error
 */
export function safeSubtract(a: number, b: number): number {
  const result = toSafeInt(a) - toSafeInt(b);
  return Math.max(0, result); // Tidak boleh negatif
}
