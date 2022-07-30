import { AxiosError, AxiosResponse } from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BlockDetails as BlockDetailsType,
  Transaction as TransactionType,
  Block as BlockType,
} from "../../types/bitcoin";
import { API_RATE_LIMIT_ERROR } from "../../constants/core";
import { decorateTransactionDetails } from "../../utils/helpers";
import {
  loadBlockDetailsById,
  loadTransactionDetailsById,
} from "../../utils/api";
import { BlockDetailsComponent } from "./BlockDetails.component";

export const BlockDetails = () => {
  const { id } = useParams() || {};

  let navigate = useNavigate();

  const handleBackClick = (): void => {
    navigate(`/blocks`, { replace: true });
  };

  const [blockDetails, setBlockDetails] = useState<BlockDetailsType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean | string>(false);
  const [paginationCount, setPaginationCount] = useState<number>(10);

  useEffect(() => {
    if (id) {
      setLoading(true);

      // get transaction details
      loadTransactionDetailsById(
        id,
        (response: AxiosResponse<{ tx: TransactionType[] }>) => {
          const { transactionsData, totalTransactionVolume } =
            decorateTransactionDetails(response.data.tx);

          // get block details - with complete additional details as well
          loadBlockDetailsById(
            id,
            (details: AxiosResponse<{ data: BlockType }>) => {
              const blockData: BlockType = details.data.data;

              if (blockData) {
                setBlockDetails({
                  ...blockData,
                  tx: transactionsData,
                  tx_vol: totalTransactionVolume,
                });
              } else {
                // error of rate limiting
                setError(API_RATE_LIMIT_ERROR);
              }

              setLoading(false);
            }
          );
        },
        (error: AxiosError) => {
          setLoading(false);
          const { message } = error || {};
          setError(message);
        }
      );
    }
  }, [id]);

  const handleLoadModeClick = () => {
    if (blockDetails && blockDetails.tx.length > paginationCount) {
      setPaginationCount((prevCount) => prevCount + 10);
    }
  };

  return (
    <BlockDetailsComponent
      {...{
        id,
        handleBackClick,
        loading,
        error,
        blockDetails,
        paginationCount,
        handleLoadModeClick,
      }}
    />
  );
};
