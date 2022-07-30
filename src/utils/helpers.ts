/*
All the helper functions, tranformation and formatting functions used in the project here
*/

import { formatDistanceToNow, format } from "date-fns";
import { Transaction } from "../types/bitcoin";

export const formatHash = (hash: string): string => {
  while (hash.substring(0, 1) === "0" && hash.length > 1) {
    hash = hash.substring(1, 9999);
  }
  return `0..${hash}`;
};

export const formatCommaNumber = (size: number): string => {
  return size.toLocaleString();
};

export const formatRelativeTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp * 1000));
};

export const formatTimestampToDate = (timestamp: number): string => {
  let formattedDate = "";
  try {
    formattedDate = format(new Date(timestamp * 1000), "yyyy-MM-dd hh:mm");
  } catch {
    formattedDate = `Timestamp error : ${timestamp}`;
  }

  return formattedDate;
};

export const parseBtcUnit = (satoshiNum: number): string => {
  return `${(satoshiNum / 10e7).toFixed(8)} BTC`;
};

export const decorateTransactionDetails = (
  transactions: Transaction[]
): { transactionsData: Transaction[]; totalTransactionVolume: number } => {
  // to calculate total transaction volume and aggregate transaction value at each row level
  let totalTransactionVolume = 0;
  const transactionsData = transactions.map((transaction: Transaction) => {
    let currentTransactionValue = 0;
    transaction.out.forEach((output): void => {
      totalTransactionVolume += output.value;
      currentTransactionValue += output.value;
    });

    return { ...transaction, trx_val: currentTransactionValue };
  });

  return {
    transactionsData,
    totalTransactionVolume,
  };
};
