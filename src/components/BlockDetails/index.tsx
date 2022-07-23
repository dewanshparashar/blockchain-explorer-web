import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

type TransactionOutput = {
  type: number;
  spent: boolean;
  value: number;
  spending_outpoints: { tx_index: number; n: number }[];
  n: number;
  tx_index: number;
  script: string;
};

type TransactionInput = {
  sequence: number;
  witness: number;
  script: number;
  index: number;
  prev_out: TransactionOutput[];
};

type Transaction = {
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

type SingleBlock = {
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
};

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
      {!loading && !error && <div>Helloooo details!</div>}
    </div>
  );
};

export default BlockDetails;
