import { Block, DetailsTemplate } from "../../types/bitcoin";
import {
  formatCommaNumber,
  formatHash,
  formatRelativeTime,
} from "../../utils/helpers";
import Link from "../common/Link";

export const TABLE_CONFIG: DetailsTemplate<Block>[] = [
  {
    key: "height",
    label: "Height",
    width: "10%",
    accessor: (block: Block) => block.height,
  },
  {
    key: "hash",
    label: "Hash",
    width: "45%",
    accessor: (block: Block) => (
      <Link to={`/block/${block.hash}`}>{formatHash(block.hash)}</Link>
    ),
  },
  {
    key: "mined",
    label: "Mined",
    width: "15%",
    accessor: (block: Block) => formatRelativeTime(block.timestamp),
  },
  {
    key: "miner",
    label: "Miner",
    width: "15%",
    accessor: (block: Block) => `${block.extras?.pool_name || "Unknown"}`,
  },
  {
    key: "size",
    label: "Size",
    width: "15%",
    accessor: (block: Block) => `${formatCommaNumber(block.size)} bytes`,
  },
];
