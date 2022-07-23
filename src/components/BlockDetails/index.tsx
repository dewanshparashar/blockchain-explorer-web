import axios, { AxiosResponse } from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SingleBlock, Transaction } from "../../types/bitcoin";
import { DetailsTemplate } from "../../types/utils";

const DETAILS_CONFIG: DetailsTemplate[] = [
  {
    key: "hash",
    label: "Hash",
    accessor: (block: SingleBlock) => block.hash,
  },
  {
    key: "confirmations",
    label: "Confirmations",
    accessor: (block: SingleBlock) => block.confirmations,
  },
  {
    key: "timestamp",
    label: "Timestamp",
    accessor: (block: SingleBlock) => block.time,
  },
  {
    key: "miner",
    label: "Miner",
    accessor: (block: SingleBlock) => block.relayed_by,
  },
  {
    key: "txCount",
    label: "Number of Transactions",
    accessor: (block: SingleBlock) => block.n_tx,
  },
  {
    key: "difficulty",
    label: "Difficulty",
    accessor: (block: SingleBlock) => block.work,
  },
  {
    key: "merkelRoot",
    label: "Merkel Root",
    accessor: (block: SingleBlock) => block.mrkl_root,
  },
  {
    key: "version",
    label: "Version",
    accessor: (block: SingleBlock) => block.ver,
  },
  {
    key: "bits",
    label: "Bits",
    accessor: (block: SingleBlock) => block.bits,
  },
  {
    key: "weight",
    label: "Weight",
    accessor: (block: SingleBlock) => block.weight,
  },
  {
    key: "size",
    label: "Size",
    accessor: (block: SingleBlock) => block.size,
  },
  {
    key: "nonce",
    label: "Nonce",
    accessor: (block: SingleBlock) => block.nonce,
  },
  {
    key: "volume",
    label: "Transaction Volume",
    accessor: (block: SingleBlock) => `${block.nonce} BTC`,
  },
  {
    key: "blockReward",
    label: "Block Reward",
    accessor: (block: SingleBlock) => `${block.nonce} BTC`,
  },
  {
    key: "feeReward",
    label: "Fee Reward",
    accessor: (block: SingleBlock) => `${block.fees} BTC`,
  },
];

const BlockDetails = () => {
  const { id } = useParams() || {};

  const [blockDetails, setBlockDetails] = useState<SingleBlock>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`https://blockchain.info/rawblock/${id}`).then(
        (response: AxiosResponse<SingleBlock>) => {
          setBlockDetails(response.data);
          setLoading(false);
        },
        () => {
          setLoading(false);
          setError(true);
        }
      );
    }
  }, [id]);

  return (
    <div>
      {loading && "Loading..."}
      {!loading && error && "Something went wrong.. this is not correct.."}
      {!loading && !error && blockDetails && (
        <div className="blockDetails">
          <h1>Block Details</h1>
          {DETAILS_CONFIG.map((template: DetailsTemplate) => (
            <div className="blockDetailRow" key={template.key}>
              <div className="key">{template.label}</div>
              <div className="value">{template.accessor(blockDetails)}</div>
            </div>
          ))}

          <hr />

          <h2>Transactions</h2>
          {blockDetails.tx.map((transaction: Transaction) => (
            <div className="transactionRow">
              <b>Hash : {transaction.hash}</b>
              <b>Fee : {transaction.fee} BTC</b>
              {JSON.stringify(transaction)}
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockDetails;
