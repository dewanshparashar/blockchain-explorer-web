import React, { useState, useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { Block, BlockHeight } from "../../types/bitcoin";
import { API_RATE_LIMIT_ERROR, MAX_LIST_SIZE } from "../../constants/core";
import { loadBlockListByHeights, loadLatestBtcHeights } from "../../utils/api";
import { BlockListComponent } from "./BlockList.component";

export const BlockListContainer = () => {
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
    <BlockListComponent
      {...{
        loading,
        error,
        blocksList,
        corsWarning,
        handleSearch,
        searchString,
        onSearchInput,
        onSearchKeyUp,
      }}
    />
  );
};
