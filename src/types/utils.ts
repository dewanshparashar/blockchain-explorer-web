import { BlockDetails } from "./bitcoin";

export type DetailsTemplate = {
  key: string;
  label: string;
  accessor: (block: BlockDetails) => number | string;
};
