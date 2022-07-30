import { AxiosError, AxiosResponse } from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BlockDetails as BlockDetailsType,
  Transaction as TransactionType,
  Block as BlockType,
} from "../../types/bitcoin";
import { DetailsTemplate } from "../../types/bitcoin";
import Loader from "../common/Loader";
import { MdArrowBack } from "react-icons/md";
import { API_RATE_LIMIT_ERROR } from "../../constants/core";
import { DETAILS_CONFIG } from "./config";
import {
  decorateTransactionDetails,
  formatTimestampToDate,
} from "../../utils/helpers";
import Text from "../common/Text";
import LoadingIssue from "../common/LoadingIssue";
import Button from "../common/Button";
import {
  loadBlockDetailsById,
  loadTransactionDetailsById,
} from "../../utils/api";
import TransactionDetails from "../TransactionDetails";
import SectionHeading from "../common/SectionHeading";
import {
  Divider,
  FlexRow,
  Row,
  RowLabel,
  RowValue,
} from "./BlockDetails.styles";

const BlockDetails = () => {
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
    <>
      <SectionHeading>
        <FlexRow>
          <div>
            <span style={{ color: "#b4b1b1" }}>BTC&nbsp;/&nbsp;</span> Block
          </div>

          <Button onClick={handleBackClick}>
            <MdArrowBack /> Blocks
          </Button>
        </FlexRow>
      </SectionHeading>

      {loading && <Loader />}

      {!loading && error && (
        <LoadingIssue
          type="block"
          id={id}
          errorMessage={error}
          handleBackClick={handleBackClick}
        />
      )}

      {!loading && !error && blockDetails && (
        <>
          <Divider />
          <Text>
            Block at depth {blockDetails.height} in the Bitcoin Blockchain. This
            block was mined on {formatTimestampToDate(blockDetails.timestamp)}{" "}
            by {blockDetails?.extras?.pool_name || "Unknown"}. It currently has{" "}
            {blockDetails.confirmations} confirmations on the Bitcoin
            blockchain.
          </Text>

          {DETAILS_CONFIG.map((template: DetailsTemplate) => (
            <Row key={template.key}>
              <RowLabel>{template.label}</RowLabel>
              <RowValue>{template.accessor(blockDetails)}</RowValue>
            </Row>
          ))}

          <SectionHeading>
            <FlexRow>
              Transactions
              <Button onClick={handleBackClick}>
                <MdArrowBack /> Blocks
              </Button>
            </FlexRow>
          </SectionHeading>

          <TransactionDetails
            blockDetails={blockDetails}
            paginationCount={paginationCount}
            handleLoadModeClick={handleLoadModeClick}
          />
        </>
      )}
    </>
  );
};

export default BlockDetails;
