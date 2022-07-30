import {
  BlockDetails,
  Transaction as TransactionType,
  TransactionInput,
  TransactionOutput,
} from "../../types/bitcoin";
import { formatTimestampToDate, parseBtcUnit } from "../../utils/helpers";
import Button from "../common/Button";
import Transaction from "../common/Transaction";
import TransactionArrow from "../common/TransactionArrow";
import {
  TransactionBlock,
  TransactionBlockSection,
  TransactionPage,
  TransactionPageResponsiveScroll,
  TransactionValue,
} from "./TransactionDetails.styles";

const TransactionDetails = ({
  blockDetails,
  paginationCount,
  handleLoadModeClick,
}: {
  blockDetails: BlockDetails;
  paginationCount: number;
  handleLoadModeClick: () => void;
}) => {
  return (
    <>
      <TransactionPage>
        <TransactionPageResponsiveScroll>
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
                      <TransactionArrow />
                    </div>
                    <div>
                      {transaction.out.map(
                        (output: TransactionOutput, index: number) => (
                          <Transaction key={index} trx={output} type="output" />
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
                      <div>{`(${(transaction.fee / transaction.size).toFixed(
                        3
                      )} sat/B - ${(
                        transaction.fee / transaction.weight
                      ).toFixed(3)} sat/WU - ${transaction.size} bytes)`}</div>
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
        Load More Transactions ({`${paginationCount}/${blockDetails.tx.length}`}
        )
      </Button>
    </>
  );
};

export default TransactionDetails;
