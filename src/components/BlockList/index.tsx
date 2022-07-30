import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Block, BlockHeight } from "../../types/bitcoin";
import { formatDistanceToNow, format } from "date-fns";
import Loader from "../common/Loader";
import { LoadingIssue } from "../BlockDetails";

const MAX_LIST_SIZE = 15;
export const API_RATE_LIMIT_ERROR =
  "Rate Limit Error: Don't abuse the API. Please try again after 15 seconds. Please contact support@btcm.group";

const Table = styled.div`
  .tableHeaderRow {
    display: flex;
    flex-direction: row;
    -webkit-box-pack: center;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    border-bottom: 1px solid #dbdfeb;

    .cell {
      font-size: 12px;
      color: rgb(103, 113, 133);
    }
  }

  .tableRow {
    flex-direction: row;
    -webkit-box-pack: start;
    justify-content: flex-start;
    margin-bottom: 0px;
    display: flex;
    -webkit-box-pack: start;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    border-bottom: 1px solid #dbdfeb;
  }

  .cell {
    flex-direction: column;
    align-items: flex-start;
    flex-direction: row;
    -webkit-box-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    padding: 0.75rem 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SearchBar = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;
  margin: 1.5rem 0;

  .searchIcon {
    position: absolute;
    opacity: 0.5;
    left: 0.75rem;
  }

  input {
    display: block;
    height: 2.7rem;
    width: 100%;
    padding: 0px 1rem;
    box-sizing: border-box;
    font-family: Inter;
    font-size: 1rem;
    color: rgb(53, 63, 82);
    border-width: 1px;
    border-color: rgb(223, 227, 235);
    border-style: solid;
    border-radius: 0.25rem;
    /* background-color: rgb(255, 255, 255); */
    background: #f2f5ff;
    background-image: none;
    outline-width: 0px;
    user-select: text;
    transition: box-shadow 0.25s ease-out 0s;
    border: 1px solid rgb(223, 227, 235);
    padding: 0px 0.5rem;
    margin-right: 0.5rem;
    padding-left: 2.5rem;
  }
`;

export const Button = styled.button`
  -webkit-font-smoothing: antialiased;
  list-style-type: none;
  font-feature-settings: "calt" 0;
  display: flex;
  flex-direction: row;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  padding: 0px 1.5rem;
  box-sizing: border-box;
  border: none;
  cursor: ${(props) => (!props.disabled ? "pointer" : "not-allowed")};
  outline: none;
  transition: all 0.3s ease 0s;
  opacity: 1;
  font-family: Inter, Helvetica, sans-serif;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  background: rgb(12, 108, 242);
  color: rgb(255, 255, 255);
  font-size: 14px;
  border-radius: 0.25rem;
  line-height: 1;
  height: 2.7rem;
  flex-grow: 0;
  opacity: ${(props) => (!props.disabled ? 1 : 0.5)};
  gap: 0.5rem;
`;

export const StyledLink = styled(Link)`
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;
  text-transform: none;
  font-style: normal;
  opacity: 1;
  cursor: pointer;
  font-family: Inter, Helvetica, sans-serif;
  text-decoration: none;
  font-feature-settings: "calt" 0;
  color: rgb(12, 108, 242);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
`;

const SectionHeadingStyled = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  padding: 1.5rem 0px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
  font-weight: 700;
  font-size: 1.5rem;
  text-transform: none;
  font-style: normal;
  opacity: 1;
  font-family: Inter, Helvetica, sans-serif;
  font-feature-settings: "calt" 0;
  color: rgb(53, 63, 82);
  position: sticky;
  top: 0px;
  background-color: rgb(255, 255, 255, 0.7);
  backdrop-filter: blur(2px);
  white-space: nowrap;

  svg {
    margin-right: 0.75rem;
  }
`;

const CORSWarning = styled.div`
  width: 100%;
  background: rgb(12, 108, 242);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  padding: 0.5rem;
  z-index: 10;
`;

export const SectionHeading = ({ children }: { children: React.ReactNode }) => {
  return (
    <SectionHeadingStyled>
      <svg viewBox="0 0 32 32" height="32px" width="32px">
        <g fill="none" fill-rule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#F7931A"></circle>
          <path
            fill="#FFF"
            fill-rule="nonzero"
            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
          ></path>
        </g>
      </svg>
      {children}
    </SectionHeadingStyled>
  );
};

const ListSection = styled.div`
  width: 100%;
  overflow: scroll;
  padding-bottom: 2rem;
`;

const ListSectionResponsiveScroll = styled.div`
  min-width: 700px;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
`;

export const formatHash = (hash: string): string => {
  while (hash.substring(0, 1) === "0" && hash.length > 1) {
    hash = hash.substring(1, 9999);
  }
  return `0..${hash}`;
};

export const formatCommaNumber = (size: number): string => {
  return size.toLocaleString();
};

const formatRelativeTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp * 1000));
};

export const formatTimestampToDate = (timestamp: number): string => {
  let formattedDate = "";
  try {
    formattedDate = format(new Date(timestamp * 1000), "yyyy-MM-dd hh:mm");
  } catch {
    formattedDate = `Timestamp error : ${timestamp}`;
  }

  return formattedDate;
};

const BlockList = () => {
  let navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [blocksList, setBlocksList] = useState<Block[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [corsWarning, setCorsWarning] = useState<boolean>(
    !!(localStorage?.getItem?.("corsResolved") !== "true")
  );

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`https://blockchain.info/blocks/${Date.now()}?format=json`)
      .then((response: AxiosResponse<BlockHeight[]>) => {
        const heights: number[] = response.data
          .map((block: BlockHeight) => block.height)
          .slice(0, MAX_LIST_SIZE);

        if (heights?.length) {
          const heightsString = heights.join(",");
          axios.get(`https://chain.api.btc.com/v3/block/${heightsString}`).then(
            (response: AxiosResponse<{ data: Block[] }>) => {
              const list = response.data?.data;
              if (list) {
                setBlocksList(list);

                // now that api is successful, set corswarning to false
                setCorsWarning(false);
                localStorage?.setItem?.("corsResolved", "true");
              } else {
                // api most probably rate limited
                setError(API_RATE_LIMIT_ERROR);
              }

              setLoading(false);
            },
            (error: AxiosError) => {
              setLoading(false);
              const { message } = error || {};
              setError(message);
            }
          );
        }
      });
  }, []);

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchString(e.target.value);
  };

  const onSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e?.key === "Enter" || e?.code === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchString) {
      navigate(`/block/${searchString}`);
    }
  };

  return (
    <>
      {corsWarning && (
        <CORSWarning>
          Please ensure you have a CORS extension enabled to access the API's.
        </CORSWarning>
      )}

      {/* Search section */}
      <SearchBar>
        <svg
          className="searchIcon"
          viewBox="0 0 512 512"
          height="1rem"
          width="1rem"
        >
          <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
        </svg>
        <input
          type="text"
          placeholder="Search for block hash"
          value={searchString}
          onChange={onSearchInput}
          onKeyUp={onSearchKeyUp}
        />
        <Button onClick={handleSearch} disabled={!searchString}>
          Search
        </Button>
      </SearchBar>

      <SectionHeading>Latest Blocks</SectionHeading>

      {error && <LoadingIssue type="list" errorMessage={error} />}

      {/* Block-listing section */}
      {!error && (
        <ListSection>
          <ListSectionResponsiveScroll>
            <Table className="blockList">
              <div className="tableHeaderRow">
                <div style={{ width: "10%" }} className="tableHeader cell">
                  Height
                </div>
                <div style={{ width: "45%" }} className="tableHeader cell">
                  Hash
                </div>
                <div style={{ width: "15%" }} className="tableHeader cell">
                  Mined
                </div>
                <div style={{ width: "15%" }} className="tableHeader cell">
                  Miner
                </div>
                <div style={{ width: "15%" }} className="tableHeader cell">
                  Size
                </div>
              </div>

              {loading && <Loader />}

              {!loading &&
                !error &&
                blocksList.map((blockRow: Block) => (
                  <div className="tableRow" key={blockRow.hash}>
                    <div style={{ width: "10%" }} className="cell">
                      {blockRow.height}
                    </div>
                    <div style={{ width: "45%" }} className="cell">
                      <StyledLink to={`/block/${blockRow.hash}`}>
                        {formatHash(blockRow.hash)}
                      </StyledLink>
                    </div>
                    <div style={{ width: "15%" }} className="cell">
                      {formatRelativeTime(blockRow.timestamp)}
                    </div>
                    <div style={{ width: "15%" }} className="cell">
                      {blockRow.extras?.pool_name || "Unknown"}
                    </div>
                    <div style={{ width: "15%" }} className="cell">
                      {formatCommaNumber(blockRow.size)} bytes
                    </div>
                  </div>
                ))}
            </Table>
          </ListSectionResponsiveScroll>
        </ListSection>
      )}
    </>
  );
};

export default BlockList;
