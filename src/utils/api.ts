import axios, { AxiosError, AxiosResponse } from "axios";
import { Block, BlockHeight, Transaction } from "../types/bitcoin";

export const loadLatestBtcHeights = (
  successCallback?: (response: AxiosResponse<BlockHeight[]>) => void,
  errorCallback?: (error: AxiosError) => void
) => {
  axios.get(`https://blockchain.info/blocks/${Date.now()}?format=json`).then(
    (response: AxiosResponse<BlockHeight[]>) => {
      successCallback?.(response);
    },
    (error: AxiosError) => {
      errorCallback?.(error);
    }
  );
};

export const loadBlockListByHeights = (
  heights: string,
  successCallback?: (response: AxiosResponse<{ data: Block[] }>) => void,
  errorCallback?: (error: AxiosError) => void
) => {
  axios.get(`https://chain.api.btc.com/v3/block/${heights}`).then(
    (response: AxiosResponse<{ data: Block[] }>) => {
      successCallback?.(response);
    },
    (error: AxiosError) => {
      errorCallback?.(error);
    }
  );
};

export const loadTransactionDetailsById = (
  id: string,
  successCallback?: (response: AxiosResponse<{ tx: Transaction[] }>) => void,
  errorCallback?: (error: AxiosError) => void
) => {
  axios.get(`https://blockchain.info/rawblock/${id}`).then(
    (response: AxiosResponse<{ tx: Transaction[] }>) => {
      successCallback?.(response);
    },
    (error: AxiosError) => {
      errorCallback?.(error);
    }
  );
};

export const loadBlockDetailsById = (
  id: string,
  successCallback?: (details: AxiosResponse<{ data: Block }>) => void,
  errorCallback?: (error: AxiosError) => void
) => {
  axios.get(`https://chain.api.btc.com/v3/block/${id}`).then(
    (details: AxiosResponse<{ data: Block }>) => {
      successCallback?.(details);
    },
    (error: AxiosError) => {
      errorCallback?.(error);
    }
  );
};
