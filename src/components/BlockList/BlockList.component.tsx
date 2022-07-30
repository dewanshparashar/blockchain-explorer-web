import React from "react";
import { Block } from "../../types/bitcoin";
import Loader from "../common/Loader";
import CorsWarningBanner from "../common/CorsWarningBanner";
import SearchBar from "../common/SearchBar";
import LoadingIssue from "../common/LoadingIssue";
import SectionHeading from "../common/SectionHeading";
import {
  ListSection,
  ListSectionResponsiveScroll,
  Table,
} from "./BlockList.styles";
import { TABLE_CONFIG } from "./config";

type BlockListProps = {
  loading: boolean;
  error: string;
  blocksList: Block[];
  corsWarning: boolean;
  handleSearch: () => void;
  searchString: string;
  onSearchInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const BlockListComponent = ({
  loading,
  error,
  blocksList,
  corsWarning,
  handleSearch,
  searchString,
  onSearchInput,
  onSearchKeyUp,
}: BlockListProps) => {
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
                {TABLE_CONFIG.map((column) => (
                  <div
                    key={column.key}
                    style={{ width: column.width }}
                    className="tableHeader cell"
                  >
                    {column.label}
                  </div>
                ))}
              </div>

              {loading && <Loader />}

              {!loading &&
                !error &&
                blocksList.map((blockRow: Block) => (
                  <div className="tableRow" key={blockRow.hash}>
                    {TABLE_CONFIG.map((column) => (
                      <div
                        key={column.key}
                        style={{ width: column.width }}
                        className="tableHeader cell"
                      >
                        {column.accessor(blockRow)}
                      </div>
                    ))}
                  </div>
                ))}
            </Table>
          </ListSectionResponsiveScroll>
        </ListSection>
      )}
    </>
  );
};
