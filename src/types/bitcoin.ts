export type Block = {
  bits: number;
  fees: number;
  hash: string;
  height: number;
  mainchain: boolean;
  merkle: string;
  nonce: number;
  outputs: number;
  previous: string;
  size: number;
  subsidy: number;
  time: number;
  tx: string[];
  version: number;
  weight: number;
  work: number;
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
};

export type TransactionInput = {
  sequence: number;
  witness: number;
  script: number;
  index: number;
  prev_out: TransactionOutput[];
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
};

export type SingleBlock = {
  hash: string;
  ver: number;
  prev_block: string;
  mrkl_root: string;
  time: number;
  bits: number;
  nonce: number;
  n_tx: number;
  size: number;
  block_index: number;
  main_chain: boolean;
  height: number;
  received_time: number;
  relayed_by: string;
  tx: Transaction[];
  weight: number;
  fees: number;
  work: number;
  confirmations: number;
};
