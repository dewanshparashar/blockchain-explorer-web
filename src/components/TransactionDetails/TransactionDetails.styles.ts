import styled from "styled-components";

export const TransactionBlock = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 1rem 0px;
  border-bottom: 1px solid rgb(223, 227, 235);
`;

export const TransactionBlockSection = styled.div`
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  flex-direction: row;

  .col {
    display: flex;
    flex-direction: row;
    -webkit-box-pack: start;
    justify-content: flex-start;
    align-items: flex-start;
    width: 50%;

    &.col2 {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: calc(100% - 100px);
      padding: 0.8rem 0px;
      -webkit-box-pack: end;
      justify-content: flex-end;
    }

    .subCol {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .subCol.sc1 {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 100px;
      padding: 0.8rem 0px;
      -webkit-box-pack: start;
      justify-content: flex-start;
      color: rgb(103, 113, 133);
    }

    .subCol.sc2 {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: calc(100% - 100px);
      padding: 0.8rem 0px;
      -webkit-box-pack: start;
      justify-content: flex-start;
    }

    .divider {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 100px;
      padding: 0.8rem 0px;
      -webkit-box-pack: end;
      align-items: flex-start;
      justify-content: center;
    }
  }
`;

export const TransactionPage = styled.div`
  width: 100%;
  overflow: scroll;
  margin-top: 2rem;
`;

export const TransactionPageResponsiveScroll = styled.div`
  min-width: 900px;
  display: flex;
  flex-direction: column;
`;

export const TransactionValue = styled.span`
  font-weight: 500;
  font-size: 14px;
  text-transform: none;
  font-style: normal;
  opacity: 1;
  display: block;
  padding: 0.25rem;
  color: rgb(0, 135, 90);
  background: rgb(209, 240, 219);
  border: 1px solid rgb(209, 240, 219);
  border-radius: 0.25rem;
  cursor: pointer;
  width: fit-content !important;
`;
