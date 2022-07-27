import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  BlockDetails as BlockDetailsType,
  Transaction as TransactionType,
  TransactionInput,
  TransactionOutput,
  TransactionMode,
} from "../../types/bitcoin";
import { DetailsTemplate } from "../../types/utils";
import { SectionHeading } from "../BlockList";

const DETAILS_CONFIG: DetailsTemplate[] = [
  {
    key: "hash",
    label: "Hash",
    accessor: (block: BlockDetailsType) => block.hash,
  },
  {
    key: "confirmations",
    label: "Confirmations",
    accessor: (block: BlockDetailsType) => block.confirmations,
  },
  {
    key: "timestamp",
    label: "Timestamp",
    accessor: (block: BlockDetailsType) => block.time,
  },
  {
    key: "height",
    label: "Height",
    accessor: (block: BlockDetailsType) => block.height,
  },
  {
    key: "miner",
    label: "Miner",
    accessor: (block: BlockDetailsType) => block.relayed_by,
  },
  {
    key: "txCount",
    label: "Number of Transactions",
    accessor: (block: BlockDetailsType) => block.n_tx,
  },
  {
    key: "difficulty",
    label: "Difficulty",
    accessor: (block: BlockDetailsType) => block.work,
  },
  {
    key: "merkelRoot",
    label: "Merkel Root",
    accessor: (block: BlockDetailsType) => block.mrkl_root,
  },
  {
    key: "version",
    label: "Version",
    accessor: (block: BlockDetailsType) => block.ver,
  },
  {
    key: "bits",
    label: "Bits",
    accessor: (block: BlockDetailsType) => block.bits,
  },
  {
    key: "weight",
    label: "Weight",
    accessor: (block: BlockDetailsType) => block.weight,
  },
  {
    key: "size",
    label: "Size",
    accessor: (block: BlockDetailsType) => block.size,
  },
  {
    key: "nonce",
    label: "Nonce",
    accessor: (block: BlockDetailsType) => block.nonce,
  },
  {
    key: "volume",
    label: "Transaction Volume",
    accessor: (block: BlockDetailsType) => `${block.nonce} BTC`,
  },
  {
    key: "blockReward",
    label: "Block Reward",
    accessor: (block: BlockDetailsType) => `${block.nonce} BTC`,
  },
  {
    key: "feeReward",
    label: "Fee Reward",
    accessor: (block: BlockDetailsType) => `${block.fees} BTC`,
  },
];

const Row = styled.div`
  font-size: 100%;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid rgb(223, 227, 235);
`;

const RowLabel = styled.div`
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  text-transform: none;
  font-style: normal;
  opacity: 1;
  font-family: Inter, Helvetica, sans-serif;
  font-feature-settings: "calt" 0;
  color: rgb(103, 113, 133);
  width: 50%;
  padding: 0.8rem 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: auto;
  text-align: left;
`;

const RowValue = styled.div`
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  text-transform: none;
  font-style: normal;
  opacity: 1;
  font-family: Inter, Helvetica, sans-serif;
  font-feature-settings: "calt" 0;
  color: rgb(53, 63, 82);
  padding: 0.8rem 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: auto;
  text-align: left;
`;

const Transaction = ({
  trx,
  type,
}: {
  trx: TransactionOutput;
  type: TransactionMode;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <b>
        {trx.addr ? (
          trx.addr
        ) : (
          <i style={{ color: "green" }}>
            {type === "input" ? "COINBASE (Newly generated)" : "OP_RETURN"}
          </i>
        )}
      </b>
      {trx.addr && <div>{trx.value} BTC</div>}
      {trx.addr && trx.spent && <div style={{ color: "green" }}>S</div>}
      {trx.addr && !trx.spent && <div style={{ color: "red" }}>U</div>}
    </div>
  );
};

const BlockDetails = () => {
  const { id } = useParams() || {};

  const [blockDetails, setBlockDetails] = useState<BlockDetailsType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`https://blockchain.info/rawblock/${id}`).then(
        (response: AxiosResponse<BlockDetailsType>) => {
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
          <SectionHeading>Block Details</SectionHeading>
          {DETAILS_CONFIG.map((template: DetailsTemplate) => (
            <Row key={template.key}>
              <RowLabel>{template.label}</RowLabel>
              <RowValue>{template.accessor(blockDetails)}</RowValue>
            </Row>
          ))}

          <SectionHeading>Transactions</SectionHeading>
          {blockDetails.tx.map((transaction: TransactionType) => (
            <div className="transactionRow">
              <b>Hash : {transaction.hash}</b>
              <b>Fee : {transaction.fee} BTC</b>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  border: "2px dashed red",
                  margin: 10,
                }}
              >
                <div
                  className="transactionInputs"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid blue",
                  }}
                >
                  {transaction.inputs.map((input: TransactionInput) => (
                    <>
                      <Transaction trx={input.prev_out} type="input" />
                    </>
                  ))}
                </div>

                <div
                  className="transactionOutputs"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {transaction.out.map((output: TransactionOutput) => (
                    <Transaction trx={output} type="output" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockDetails;
