export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function formatNumber(num: number, decimals = 2): string {
  return num.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(ts: number): string {
  return `${formatDate(ts)} ${formatTime(ts)}`;
}

/**
 * Get ISO date string (YYYY-MM-DD) untuk consistent date handling
 * Ini penting untuk matching transactions dengan withdrawals
 */
export function getDateKey(timestamp: number): string {
  return new Date(timestamp).toISOString().split('T')[0];
}

export const EXPENSE_CATEGORIES_HARIAN = ['Makanan', 'Hiburan', 'Kuliah'] as const;
export const EXPENSE_CATEGORIES_KHUSUS = ['Keperluan Rumah', 'Internet/Pulsa', 'Kuliah', 'Hiburan', 'Motor', 'Style', 'Lainnya'] as const;
export const SAVINGS_CATEGORIES = ['Tabungan Investasi', 'Tabungan Darurat'] as const;
export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES_HARIAN, ...EXPENSE_CATEGORIES_KHUSUS, ...SAVINGS_CATEGORIES] as const;
