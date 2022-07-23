import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";

type Block = {
  bits: number;
  fees: number;
  hash: string;
  height: number;
  mainchain: boolean;
  merkle: string;
  nonce: number;
  outputs: number;
  previous: string;
  size: number;
  subsidy: number;
  time: number;
  tx: string[];
  version: number;
  weight: number;
  work: number;
};

type BlockHeight = {
  block_index: number;
  hash: string;
  height: number;
  time: number;
};

const MAX_LIST_SIZE = 15;

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
      <div className="search">
        <input type="text" />
        <button> Search </button>
      </div>

      {loading && <div className="loader">Loading...</div>}

      {/* Block-listing section */}
      <table className="blockList">
        <thead>
          <tr>
            <th className="tableHeader">Height</th>
            <th className="tableHeader">Hash</th>
            <th className="tableHeader">Mined</th>
            <th className="tableHeader">Miner</th>
            <th className="tableHeader">Size</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            blocksList.map((blockRow: Block) => (
              <tr className="tableRow" key={blockRow.hash}>
                <td className="tableCell">{blockRow.height}</td>
                <td className="tableCell">
                  <Link to={`/block/${blockRow.hash}`}>{blockRow.hash}</Link>
                </td>
                <td className="tableCell">
                  {new Date(blockRow.time).toTimeString()}
                </td>
                <td className="tableCell">{blockRow.tx?.[0]}</td>
                <td className="tableCell">{blockRow.size} bytes</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default BlockList;
