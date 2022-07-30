import styled from "styled-components";
import Button from "./Button";

const SearchBarStyled = styled.div`
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
    font-size: 1rem;
    color: rgb(53, 63, 82);
    border-width: 1px;
    border-color: rgb(223, 227, 235);
    border-style: solid;
    border-radius: 0.25rem;
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

type SearchBarProps = {
  handleSearch: () => void;
  searchString: string;
  onSearchInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const SearchBar = ({
  handleSearch,
  searchString,
  onSearchInput,
  onSearchKeyUp,
}: SearchBarProps) => (
  <SearchBarStyled>
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
  </SearchBarStyled>
);

export default SearchBar;
