import { SingleBlock } from "./bitcoin";

export type DetailsTemplate = {
  key: string;
  label: string;
  accessor: (block: SingleBlock) => number | string;
};
