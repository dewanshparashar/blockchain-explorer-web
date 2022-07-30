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

export type TransactionInput = {
  sequence: number;
  witness: number;
  script: number;
  index: number;
  prev_out: TransactionOutput;
};

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

export type BlockDetails = Block & {
  tx: Transaction[];
  tx_vol: number;
};

export type TransactionMode = "input" | "output";

export type DetailsTemplate = {
  key: string;
  label: string;
  accessor: (block: BlockDetails) => number | string;
};
