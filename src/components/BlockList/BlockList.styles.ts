import styled from "styled-components";

export const Table = styled.div`
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

export const ListSection = styled.div`
  width: 100%;
  overflow: scroll;
  padding-bottom: 2rem;
`;

export const ListSectionResponsiveScroll = styled.div`
  min-width: 700px;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
`;
