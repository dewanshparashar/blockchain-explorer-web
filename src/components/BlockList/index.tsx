import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import { Block, BlockHeight } from "../../types/bitcoin";
import { formatDistanceToNow } from "date-fns";

const MAX_LIST_SIZE = 15;

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
  cursor: pointer;
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

export const SectionHeading = styled.div`
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
`;

export const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem;
`;

const formatHash = (hash: string): string => {
  while (hash.substring(0, 1) === "0" && hash.length > 1) {
    hash = hash.substring(1, 9999);
  }
  return `0..${hash}`;
};

const formatSize = (size: number): string => {
  return size.toLocaleString();
};

const formatRelativeTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp * 1000));
};

const BlockList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [blocksList, setBlocksList] = useState<Block[]>([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://blockchain.info/blocks/${Date.now()}?format=json`)
      .then((response: AxiosResponse<BlockHeight[]>) => {
        const heights: number[] = response.data
          .map((block: BlockHeight) => block.height)
          .slice(0, MAX_LIST_SIZE);

        if (heights?.length) {
          const heightsString = heights.join(",");
          axios
            .get(
              `https://api.blockchain.info/haskoin-store/btc/block/heights?heights=${heightsString}&notx=true`
            )
            .then((response: AxiosResponse<Block[]>) => {
              setBlocksList(response.data);
              setLoading(false);
            });
        }
      });
  }, []);

  return (
    <>
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
          placeholder="Search for things like address, transaction, block"
        />
        <Button> Search </Button>
      </SearchBar>

      <SectionHeading>Latest Blocks</SectionHeading>

      {/* Block-listing section */}
      <Table className="blockList">
        <div className="tableHeaderRow">
          <div style={{ width: "10%" }} className="tableHeader cell">
            Height
          </div>
          <div style={{ width: "40%" }} className="tableHeader cell">
            Hash
          </div>
          <div style={{ width: "15%" }} className="tableHeader cell">
            Mined
          </div>
          <div style={{ width: "15%" }} className="tableHeader cell">
            Miner
          </div>
          <div style={{ width: "20%" }} className="tableHeader cell">
            Size
          </div>
        </div>

        {loading && <Loader>Loading...</Loader>}

        {!loading &&
          blocksList.map((blockRow: Block) => (
            <div className="tableRow" key={blockRow.hash}>
              <div style={{ width: "10%" }} className="cell">
                {blockRow.height}
              </div>
              <div style={{ width: "40%" }} className="cell">
                <StyledLink to={`/block/${blockRow.hash}`}>
                  {formatHash(blockRow.hash)}
                </StyledLink>
              </div>
              <div style={{ width: "15%" }} className="cell">
                {formatRelativeTime(blockRow.time)}
              </div>
              <div style={{ width: "15%" }} className="cell">
                {blockRow.tx?.[0]}
              </div>
              <div style={{ width: "20%" }} className="cell">
                {formatSize(blockRow.size)} bytes
              </div>
            </div>
          ))}
      </Table>
    </>
  );
};

export default BlockList;
