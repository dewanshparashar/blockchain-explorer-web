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
} from "../../types/bitcoin";
import { DetailsTemplate } from "../../types/utils";
import { Button, SectionHeading, StyledLink } from "../BlockList";
import Loader from "../common/Loader";
import { MdArrowBack, MdLanguage, MdArrowForward } from "react-icons/md";
import { format } from "date-fns";

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

const BlockLoadingIssue = ({
  id,
  errorMessage,
  handleBackClick,
}: {
  id: string | undefined;
  errorMessage: string | boolean;
  handleBackClick: () => void;
}) => {
  return (
    <>
      <Text>
        <b>Unable to load block details for your query</b>
        {id && <i>: {id}</i>}
      </Text>

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
        This can be due to any of the two reasons :
        <ul>
          <li>
            The block you were looking for doesn’t exist.{" "}
            <p>Check for any typos or mistakes in your search query</p>
          </li>
          <li>
            Something went wrong in the backend server while loading the data.{" "}
            <p>
              It is recommended to add a CORS-unblocker extension to your Chrome
              browser before testing.
            </p>
          </li>
        </ul>
      </Text>
      <br />
      <Button onClick={handleBackClick}>
        <MdArrowBack /> Go Back to Blocks
      </Button>
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
    }

    .subCol.sc2 {
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
`;

const TransactionPage = styled.div`
  min-width: 900px;
  overflow: scroll;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
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
        ) : (
          <div style={{ color: "green" }}>
            {type === "input"
              ? "COINBASE (Newly generated coins)"
              : "OP_RETURN"}
          </div>
        )}
      </StyledLink>
      <div className="additionalDetails">
        {trx.addr && <div>{trx.value} BTC</div>}
        {!trx.addr && type === "output" && <div>0.00000000 BTC</div>}
        {trx.addr && trx.spent && <MdLanguage style={{ color: "green" }} />}
        {trx.addr && !trx.spent && <MdLanguage style={{ color: "red" }} />}
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
      axios.get(`https://blockchain.info/rawblock/${id}`).then(
        (response: AxiosResponse<BlockDetailsType>) => {
          setBlockDetails(response.data);
          setLoading(false);
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
          Block Details
          <Button onClick={handleBackClick}>
            <MdArrowBack /> Blocks
          </Button>
        </FlexRow>
      </SectionHeading>
      {loading && <Loader />}
      {!loading && error && (
        <BlockLoadingIssue
          id={id}
          errorMessage={error}
          handleBackClick={handleBackClick}
        />
      )}
      {!loading && !error && blockDetails && (
        <>
          {DETAILS_CONFIG.map((template: DetailsTemplate) => (
            <Row key={template.key}>
              <RowLabel>{template.label}</RowLabel>
              <RowValue>{template.accessor(blockDetails)}</RowValue>
            </Row>
          ))}

          <TransactionPage>
            <SectionHeading>
              <FlexRow>
                Transactions
                <Button onClick={handleBackClick}>
                  <MdArrowBack /> Blocks
                </Button>
              </FlexRow>
            </SectionHeading>

            {blockDetails.tx
              .filter((_, index) => index < paginationCount)
              .map((transaction: TransactionType) => (
                <TransactionBlock key={transaction.hash}>
                  <TransactionBlockSection>
                    <div className="col col1">
                      <div className="subCol sc1">Hash</div>
                      <div className="subCol sc2 hash">{transaction.hash}</div>
                    </div>
                    <div className="col col2">
                      <div className="divider"></div>
                      <div>
                        {format(
                          new Date(transaction.time * 1000),
                          "yyyy-MM-dd hh:mm"
                        )}
                      </div>
                    </div>
                  </TransactionBlockSection>

                  <TransactionBlockSection>
                    <div className="col col1">
                      <div className="subCol sc1"></div>
                      <div className="subCol sc2">
                        <div>
                          {transaction.inputs.map(
                            (input: TransactionInput, index: number) => (
                              <>
                                <Transaction
                                  key={index}
                                  trx={input.prev_out}
                                  type="input"
                                />
                              </>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col col2">
                      <div className="divider">
                        <MdArrowForward size={20} style={{ color: "green" }} />
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
                      <div className="subCol sc2">{transaction.fee} BTC</div>
                    </div>
                    <div className="col col2">
                      <div className="divider"></div>
                      <div>Total Fee sum - BTC</div>
                    </div>
                  </TransactionBlockSection>
                </TransactionBlock>
              ))}

            <br />
            <Button
              onClick={handleLoadModeClick}
              disabled={blockDetails.tx.length < paginationCount}
            >
              Load More Transactions (
              {`${paginationCount}/${blockDetails.tx.length}`})
            </Button>
          </TransactionPage>
        </>
      )}
    </>
  );
};

export default BlockDetails;
