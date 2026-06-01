/**
 * Transaction logging dan debugging utilities
 */

interface TransactionLog {
  timestamp: number;
  action: string;
  data: Record<string, any>;
}

const transactionLogs: TransactionLog[] = [];

export function logTransaction(action: string, data: Record<string, any>) {
  const log: TransactionLog = {
    timestamp: Date.now(),
    action,
    data: { ...data },
  };
  transactionLogs.push(log);
  console.log(`[TX LOG] ${action}:`, data);
}

export function getTransactionLogs(): TransactionLog[] {
  return [...transactionLogs];
}

export function clearTransactionLogs() {
  transactionLogs.length = 0;
}
