/*
  For Bitcoin - these are the types/contracts which we receive from API's
  This is a good documentation and check for all the keys from project maintenance perspective
*/

// Bitcoin block - listing page
export type Block = {
  height: number;
  version: number;
  mrkl_root: string;
  timestamp: number;
  bits: number;
  nonce: number;
  hash: string;
  prev_block_hash: string;
  next_block_hash: string;
  size: number;
  pool_difficulty: number;
  difficulty: number;
  difficulty_double: number;
  tx_count: number;
  reward_block: number;
  reward_fees: number;
  confirmations: number;
  is_orphan: false;
  curr_max_timestamp: number;
  is_sw_block: true;
  stripped_size: number;
  sigops: number;
  weight: number;
  extras?: {
    pool_name?: string;
    pool_link?: string;
  };
};

export type BlockHeight = {
  block_index: number;
  hash: string;
  height: number;
  time: number;
};

// Bitcoin transaction output
export type TransactionOutput = {
  type: number;
  spent: boolean;
  value: number;
  spending_outpoints: { tx_index: number; n: number }[];
  n: number;
  tx_index: number;
  script: string;
  addr: string;
};

// Bitcoin transaction input
export type TransactionInput = {
  sequence: number;
  witness: number;
  script: number;
  index: number;
  prev_out: TransactionOutput;
};

// Complete Bitcoin transaction details
export type Transaction = {
  hash: string;
  ver: number;
  vin_sz: number;
  vout_sz: number;
  size: number;
  weight: number;
  fee: number;
  relayed_by: string;
  lock_time: number;
  tx_index: number;
  double_spend: boolean;
  time: number;
  block_index: number;
  block_height: number;
  inputs: TransactionInput[];
  out: TransactionOutput[];
  trx_val: number;
};

// Bitcoin block - complete details page (block + extra keys + transactions)
export type BlockDetails = Block & {
  tx: Transaction[];
  tx_vol: number;
};

export type TransactionMode = "input" | "output";

export type DetailsTemplate<T> = {
  key: string;
  label: string;
  width?: string;
  accessor: (block: T) => number | string | React.ReactNode;
};
