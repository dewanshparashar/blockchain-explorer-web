import {
  BlockDetails,
  BlockDetails as BlockDetailsType,
  DetailsTemplate,
} from "../../types/bitcoin";
import {
  formatCommaNumber,
  formatHash,
  formatTimestampToDate,
  parseBtcUnit,
} from "../../utils/helpers";

export const DETAILS_CONFIG: DetailsTemplate<BlockDetails>[] = [
  {
    key: "hash",
    label: "Hash",
    accessor: (block: BlockDetailsType) => formatHash(block.hash),
  },
  {
    key: "confirmations",
    label: "Confirmations",
    accessor: (block: BlockDetailsType) => block.confirmations,
  },
  {
    key: "timestamp",
    label: "Timestamp",
    accessor: (block: BlockDetailsType) =>
      formatTimestampToDate(block.timestamp),
  },
  {
    key: "height",
    label: "Height",
    accessor: (block: BlockDetailsType) => block.height,
  },
  {
    key: "miner",
    label: "Miner",
    accessor: (block: BlockDetailsType) => block.extras?.pool_name || "Unknown",
  },
  {
    key: "txCount",
    label: "Number of Transactions",
    accessor: (block: BlockDetailsType) => formatCommaNumber(block.tx_count),
  },
  {
    key: "difficulty",
    label: "Difficulty",
    accessor: (block: BlockDetailsType) =>
      formatCommaNumber(block.difficulty_double),
  },
  {
    key: "merkelRoot",
    label: "Merkel Root",
    accessor: (block: BlockDetailsType) => block.mrkl_root,
  },
  {
    key: "version",
    label: "Version",
    accessor: (block: BlockDetailsType) => block.version,
  },
  {
    key: "bits",
    label: "Bits",
    accessor: (block: BlockDetailsType) => formatCommaNumber(block.bits),
  },
  {
    key: "weight",
    label: "Weight",
    accessor: (block: BlockDetailsType) =>
      `${formatCommaNumber(block.weight)} WU`,
  },
  {
    key: "size",
    label: "Size",
    accessor: (block: BlockDetailsType) =>
      `${formatCommaNumber(block.size)} bytes`,
  },
  {
    key: "nonce",
    label: "Nonce",
    accessor: (block: BlockDetailsType) => formatCommaNumber(block.nonce),
  },
  {
    key: "volume",
    label: "Transaction Volume",
    accessor: (block: BlockDetailsType) => parseBtcUnit(block.tx_vol),
  },
  {
    key: "blockReward",
    label: "Block Reward",
    accessor: (block: BlockDetailsType) => parseBtcUnit(block.reward_block),
  },
  {
    key: "feeReward",
    label: "Fee Reward",
    accessor: (block: BlockDetailsType) => parseBtcUnit(block.reward_fees),
  },
];
