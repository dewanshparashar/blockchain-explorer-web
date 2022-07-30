import React, { useState, useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { Block, BlockHeight } from "../../types/bitcoin";
import Loader from "../common/Loader";
import { API_RATE_LIMIT_ERROR, MAX_LIST_SIZE } from "../../constants/core";
import {
  formatCommaNumber,
  formatHash,
  formatRelativeTime,
} from "../../utils/helpers";
import { loadBlockListByHeights, loadLatestBtcHeights } from "../../utils/api";
import CorsWarningBanner from "../common/CorsWarningBanner";
import SearchBar from "../common/SearchBar";
import LoadingIssue from "../common/LoadingIssue";
import Link from "../common/Link";
import SectionHeading from "../common/SectionHeading";
import {
  ListSection,
  ListSectionResponsiveScroll,
  Table,
} from "./BlockList.styles";

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

    loadLatestBtcHeights(
      (response: AxiosResponse<BlockHeight[]>) => {
        const heights: number[] = response.data
          .map((block: BlockHeight) => block.height)
          .slice(0, MAX_LIST_SIZE);

        loadBlockListByHeights(
          heights.join(","),
          (response: AxiosResponse<{ data: Block[] }>) => {
            const list = response.data?.data;
            if (list) {
              setBlocksList(list);

              // now that api is successful, set corsWarning to false
              setCorsWarning(false);
              localStorage?.setItem?.("corsResolved", "true");
            } else {
              // api most probably rate limited
              setError(API_RATE_LIMIT_ERROR);
            }

            setLoading(false);
          },
          (error: AxiosError) => {
            handleAxiosError(error);
          }
        );
      },
      (error: AxiosError) => {
        handleAxiosError(error);
      }
    );
  }, []);

  const handleAxiosError = (error: AxiosError) => {
    setLoading(false);
    const { message } = error || {};
    setError(message);
  };

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
      {corsWarning && <CorsWarningBanner />}

      {/* Search section */}
      <SearchBar
        handleSearch={handleSearch}
        searchString={searchString}
        onSearchInput={onSearchInput}
        onSearchKeyUp={onSearchKeyUp}
      />

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
                      <Link to={`/block/${blockRow.hash}`}>
                        {formatHash(blockRow.hash)}
                      </Link>
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
