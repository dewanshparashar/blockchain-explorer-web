import { MdLanguage } from "react-icons/md";
import styled from "styled-components";
import { TransactionMode, TransactionOutput } from "../../types/bitcoin";
import { parseBtcUnit } from "../../utils/helpers";
import Link from "./Link";

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

const Transaction = ({
  trx,
  type,
}: {
  trx: TransactionOutput;
  type: TransactionMode;
}) => {
  return (
    <TransactionRow>
      <Link to="#" className="hash">
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
      </Link>
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

export default Transaction;
