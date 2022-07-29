import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  BlockDetails as BlockDetailsType,
  Transaction as TransactionType,
  TransactionInput,
  TransactionOutput,
  TransactionMode,
  Block as BlockType,
} from "../../types/bitcoin";
import { DetailsTemplate } from "../../types/utils";
import {
  API_RATE_LIMIT_ERROR,
  Button,
  formatCommaNumber,
  formatHash,
  formatTimestampToDate,
  SectionHeading,
  StyledLink,
} from "../BlockList";
import Loader from "../common/Loader";
import { MdArrowBack, MdLanguage } from "react-icons/md";
import { format } from "date-fns";

const parseBtcUnit = (satoshiNum: number): string => {
  return `${(satoshiNum / 10e7).toFixed(8)} BTC`;
};

const DETAILS_CONFIG: DetailsTemplate[] = [
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
  flex-grow: 0;
  flex-shrink: 0;
  width: 50%;
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
  flex-grow: 0;
  flex-shrink: 0;
  width: 50%;
`;

const Text = styled.p`
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
`;

export const LoadingIssue = ({
  id,
  type = "block",
  errorMessage,
  handleBackClick,
}: {
  id?: string | undefined;
  type: "block" | "list";
  errorMessage: string | boolean;
  handleBackClick?: () => void;
}) => {
  return (
    <>
      {type === "block" && (
        <Text>
          <b>Unable to load block details for your query</b>
          {id && <i>: {id}</i>}
        </Text>
      )}

      {type === "list" && (
        <Text>
          <b>Unable to load block listing</b>
          {id && <i>: {id}</i>}
        </Text>
      )}

      {errorMessage && (
        <p
          style={{
            background: "#ffc0cb4f",
            padding: "1rem",
            color: "red",
            borderRadius: "0.25rem",
          }}
        >
          {errorMessage}
        </p>
      )}

      <Text>
        This can be due to any of these reasons :
        <ul>
          {type === "block" && (
            <li>
              <p>
                The block you were looking for doesn’t exist.
                <br />
                Check for any typos or mistakes in your search query
              </p>
            </li>
          )}
          <li>
            <p>
              Your BTC.com API has been rate-limited because of detected abuse.
              <br />
              Please try again after{" "}
              <span style={{ color: "red" }}>15 seconds</span>.
            </p>
          </li>
          <li>
            <p>
              Something went wrong in the backend server while loading the data.
              <br />
              It is recommended to add a CORS-unblocker extension to your Chrome
              browser before testing.
            </p>
          </li>
        </ul>
      </Text>
      <br />
      {handleBackClick && (
        <Button onClick={handleBackClick}>
          <MdArrowBack /> Go Back to Blocks
        </Button>
      )}
    </>
  );
};

const TransactionRow = styled.div`
  font-size: 100%;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  flex-direction: row;
  -webkit-box-pack: justify;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5px;
  gap: 10px;

  .hash {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .additionalDetails {
    font-size: 100%;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    white-space: nowrap;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    -webkit-box-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    align-items: center;
    gap: 5px;
  }
`;

const TransactionBlock = styled.div`
  font-size: 100%;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 1rem 0px;
  border-bottom: 1px solid rgb(223, 227, 235);
`;

const TransactionBlockSection = styled.div`
  font-size: 100%;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  flex-direction: row;

  .col {
    font-size: 100%;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    -webkit-box-pack: start;
    justify-content: flex-start;
    align-items: flex-start;
    width: 50%;

    &.col2 {
      font-size: 100%;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: calc(100% - 100px);
      padding: 0.8rem 0px;
      -webkit-box-pack: end;
      justify-content: flex-end;
    }

    .subCol {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .subCol.sc1 {
      font-size: 100%;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 100px;
      padding: 0.8rem 0px;
      -webkit-box-pack: start;
      justify-content: flex-start;
      color: rgb(103, 113, 133);
    }

    .subCol.sc2 {
      font-size: 100%;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: calc(100% - 100px);
      padding: 0.8rem 0px;
      -webkit-box-pack: start;
      justify-content: flex-start;
    }

    .divider {
      font-size: 100%;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 100px;
      padding: 0.8rem 0px;
      -webkit-box-pack: end;
      align-items: flex-start;
      justify-content: center;
    }
  }
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
`;

const TransactionPage = styled.div`
  width: 100%;
  overflow: scroll;
  margin-top: 2rem;
`;

const TransactionPageResponsiveScroll = styled.div`
  min-width: 900px;
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  margin: 0.5rem 0rem;
  background: rgb(223, 227, 235);
  display: block;
`;

const TransactionValue = styled.span`
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  white-space: nowrap;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  text-transform: none;
  font-style: normal;
  opacity: 1;
  font-family: Inter, Helvetica, sans-serif;
  font-feature-settings: "calt" 0;
  display: block;
  padding: 0.25rem;
  color: rgb(0, 135, 90);
  background: rgb(209, 240, 219);
  border: 1px solid rgb(209, 240, 219);
  border-radius: 0.25rem;
  cursor: pointer;
  width: fit-content !important;
`;

const Transaction = ({
  trx,
  type,
}: {
  trx: TransactionOutput;
  type: TransactionMode;
}) => {
  return (
    <TransactionRow>
      <StyledLink to="#" className="hash">
        {trx.addr ? (
          trx.addr
        ) : type === "input" ? (
          <div style={{ color: "green" }}>
            COINBASE <br />
            (Newly generated coins)
          </div>
        ) : (
          <div style={{ color: "gray" }}>OP_RETURN</div>
        )}
      </StyledLink>
      <div className="additionalDetails">
        {trx.addr && <div>{parseBtcUnit(trx.value)}</div>}
        {!trx.addr && type === "output" && <div>{parseBtcUnit(0)}</div>}
        {trx.addr && trx.spent && (
          <MdLanguage style={{ color: "green" }} title="Unspent" />
        )}
        {trx.addr && !trx.spent && (
          <MdLanguage style={{ color: "red" }} title="Spent" />
        )}
      </div>
    </TransactionRow>
  );
};

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
      axios.get(`https://blockchain.info/rawblock/${id}`).then(
        (response: AxiosResponse<{ tx: TransactionType[] }>) => {
          let transactionsData = response.data.tx;

          let transactionVolume = 0;
          transactionsData = transactionsData.map(
            (transaction: TransactionType) => {
              let currentTransactionValue = 0;
              transaction.out.forEach((output): void => {
                transactionVolume += output.value;
                currentTransactionValue += output.value;
              });

              return { ...transaction, trx_val: currentTransactionValue };
            }
          );

          // get block details - with complete additional details as well
          axios
            .get(`https://chain.api.btc.com/v3/block/${id}`)
            .then((details: AxiosResponse<{ data: BlockType }>) => {
              const blockData: BlockType = details.data.data;

              if (blockData) {
                setBlockDetails({
                  ...blockData,
                  tx: transactionsData,
                  tx_vol: transactionVolume,
                });
              } else {
                // error of rate limiting
                setError(API_RATE_LIMIT_ERROR);
              }

              setLoading(false);
            });
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

          <TransactionPage>
            <TransactionPageResponsiveScroll>
              {blockDetails.tx
                .filter((_, index) => index < paginationCount)
                .map((transaction: TransactionType) => (
                  <TransactionBlock key={transaction.hash}>
                    <TransactionBlockSection>
                      <div className="col col1">
                        <div className="subCol sc1">Hash</div>
                        <div className="subCol sc2 hash">
                          {transaction.hash}
                        </div>
                      </div>
                      <div className="col col2">
                        <div className="divider"></div>
                        <div>{formatTimestampToDate(transaction.time)}</div>
                      </div>
                    </TransactionBlockSection>

                    <TransactionBlockSection>
                      <div className="col col1">
                        <div className="subCol sc1"></div>
                        <div className="subCol sc2">
                          <div>
                            {transaction.inputs.map(
                              (input: TransactionInput, index: number) => (
                                <Transaction
                                  key={index}
                                  trx={input.prev_out}
                                  type="input"
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col col2">
                        <div className="divider">
                          <svg
                            enable-background="new 0 0 32 32"
                            height="32px"
                            id="svg2"
                            version="1.1"
                            viewBox="0 0 32 32"
                            width="32px"
                            fill="rgb(51, 159, 123)"
                          >
                            <g id="background">
                              <rect fill="none" height="32" width="32"></rect>
                            </g>
                            <g id="arrow_x5F_full_x5F_right">
                              <polygon points="16,2.001 16,10 2,10 2,22 16,22 16,30 30,16  "></polygon>
                            </g>
                          </svg>
                        </div>
                        <div>
                          {transaction.out.map(
                            (output: TransactionOutput, index: number) => (
                              <Transaction
                                key={index}
                                trx={output}
                                type="output"
                              />
                            )
                          )}
                        </div>
                      </div>
                    </TransactionBlockSection>

                    <TransactionBlockSection>
                      <div className="col col1">
                        <div className="subCol sc1">Fee</div>
                        <div className="subCol sc2">
                          <div>{parseBtcUnit(transaction.fee)}</div>
                          <div>{`(${(
                            transaction.fee / transaction.size
                          ).toFixed(3)} sat/B - ${(
                            transaction.fee / transaction.weight
                          ).toFixed(3)} sat/WU - ${
                            transaction.size
                          } bytes)`}</div>
                        </div>
                      </div>
                      <div className="col col2">
                        <div className="divider"></div>
                        <div>
                          <TransactionValue>
                            {parseBtcUnit(transaction.trx_val)}
                          </TransactionValue>
                        </div>
                      </div>
                    </TransactionBlockSection>
                  </TransactionBlock>
                ))}
            </TransactionPageResponsiveScroll>
          </TransactionPage>

          <br />
          <Button
            onClick={handleLoadModeClick}
            disabled={blockDetails.tx.length < paginationCount}
          >
            Load More Transactions (
            {`${paginationCount}/${blockDetails.tx.length}`})
          </Button>
        </>
      )}
    </>
  );
};

export default BlockDetails;
