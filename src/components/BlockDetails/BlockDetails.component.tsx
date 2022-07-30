import { BlockDetails, DetailsTemplate } from "../../types/bitcoin";
import Loader from "../common/Loader";
import { MdArrowBack } from "react-icons/md";
import { DETAILS_CONFIG } from "./config";
import { formatTimestampToDate } from "../../utils/helpers";
import Text from "../common/Text";
import LoadingIssue from "../common/LoadingIssue";
import Button from "../common/Button";
import TransactionDetails from "../TransactionDetails";
import SectionHeading from "../common/SectionHeading";
import {
  Divider,
  FlexRow,
  Row,
  RowLabel,
  RowValue,
} from "./BlockDetails.styles";

type BlockDetailsProps = {
  id: string | undefined;
  loading: boolean;
  error: string | boolean;
  blockDetails: BlockDetails | undefined;
  paginationCount: number;
  handleBackClick: () => void;
  handleLoadModeClick: () => void;
};

export const BlockDetailsComponent = ({
  id,
  handleBackClick,
  loading,
  error,
  blockDetails,
  paginationCount,
  handleLoadModeClick,
}: BlockDetailsProps) => {
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

          {DETAILS_CONFIG.map((template: DetailsTemplate<BlockDetails>) => (
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
