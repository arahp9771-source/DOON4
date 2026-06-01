import { getTransactions, getSavingsHistory, addSavingsHistory, type Transaction } from '../db';
import { getDateKey } from './format';

/**
 * LIFO Logic untuk Calculate Adjusted Savings saat Withdraw
 * Menghitung mundur dari hari ini ke hari sebelumnya
 */
export async function calculateAdjustedSavings(
  type: 'investasi' | 'darurat',
  withdrawAmount: number
) {
  const history = await getSavingsHistory(type);
  
  if (history.length === 0) {
    return { adjustments: {}, totalAdjustment: 0 };
  }

  // Sort by date descending (terbaru dulu)
  const sortedHistory = history.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const adjustments: Record<string, number> = {};
  let remaining = withdrawAmount;
  let totalAdjustment = 0;

  // Iterate from newest to oldest (LIFO)
  for (const record of sortedHistory) {
    if (remaining <= 0) break;

    const currentDayAmount = record.amount;
    const amountToReduce = Math.min(remaining, currentDayAmount);
    
    adjustments[record.date] = amountToReduce;
    remaining -= amountToReduce;
    totalAdjustment += amountToReduce;
  }

  return { adjustments, totalAdjustment };
}

/**
 * Get affected days info untuk adjusted amounts
 */
export function getAffectedDays(adjustments: Record<string, number>) {
  return Object.entries(adjustments)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Determine which category to reduce in expense
 * Rules:
 * - Jika withdraw dari investasi, kurangi "Tabungan Investasi" dari pengeluaran
 * - Jika withdraw dari darurat, kurangi "Tabungan Darurat" dari pengeluaran
 */
export function getExpenseCategoryForWithdraw(type: 'investasi' | 'darurat'): string {
  return `Tabungan ${type === 'investasi' ? 'Investasi' : 'Darurat'}`;
}

/**
 * Get affected transactions yang perlu di-adjust
 * Digunakan untuk menghitung burn rate & total pengeluaran yang benar
 * Menggunakan getDateKey untuk consistent date formatting (YYYY-MM-DD)
 */
export async function getAffectedTransactions(
  type: 'investasi' | 'darurat',
  adjustments: Record<string, number>
) {
  const allTransactions = await getTransactions();
  const affectedDates = Object.keys(adjustments);
  const category = getExpenseCategoryForWithdraw(type);

  return allTransactions.filter((tx) => {
    // Gunakan getDateKey untuk consistent date formatting
    const txDate = getDateKey(tx.timestamp);
    
    return affectedDates.includes(txDate) && 
           tx.category === category && 
           tx.type === 'expense';
  });
}

/**
 * Calculate total expense reduction untuk withdraw to balance
 * Menghitung berapa total yang harus dikurangi dari analytics
 */
export async function calculateTotalExpenseReduction(
  type: 'investasi' | 'darurat',
  adjustments: Record<string, number>
): Promise<number> {
  const affectedTxs = await getAffectedTransactions(type, adjustments);
  
  // Jumlahkan semua savings transactions yang affected
  return affectedTxs.reduce((sum, tx) => sum + tx.amount, 0);
}

/**
 * Get all withdraw_to_balance transactions untuk audit/calculation
 * Menggunakan getDateKey untuk consistent date formatting (YYYY-MM-DD)
 */
export async function getWithdrawToBalanceTransactions(): Promise<Array<{
  date: string;
  type: 'investasi' | 'darurat';
  amount: number;
}>> {
  const allTransactions = await getTransactions();
  
  return allTransactions
    .filter((tx) => tx.type === 'withdraw_to_balance')
    .map((tx) => ({
      date: getDateKey(tx.timestamp),
      type: (tx.withdrawFrom || 'investasi') as 'investasi' | 'darurat',
      amount: tx.amount,
    }));
}
