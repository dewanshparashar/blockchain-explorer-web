import Countdown from "react-countdown";
import { MdArrowBack } from "react-icons/md";
import Button from "./Button";
import Text from "./Text";

type LoadingIssueProps = {
  id?: string | undefined;
  type: "block" | "list";
  errorMessage: string | boolean;
  handleBackClick?: () => void;
};

const LoadingIssue = ({
  id,
  type = "block",
  errorMessage,
  handleBackClick,
}: LoadingIssueProps) => {
  const countdownRenderer = ({
    seconds,
    completed,
  }: {
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      // Render a completed state
      return "now";
    } else {
      // Render a countdown
      return <span>{` after ${seconds} seconds`}</span>;
    }
  };

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
              Please try again{" "}
              <span style={{ color: "red" }}>
                <Countdown
                  date={Date.now() + 15000}
                  renderer={countdownRenderer}
                />
              </span>
              .
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

export default LoadingIssue;
