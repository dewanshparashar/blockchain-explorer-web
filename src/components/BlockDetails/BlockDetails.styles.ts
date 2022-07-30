import styled from "styled-components";

export const Row = styled.div` 
  display: flex;
  flex-direction: row;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid rgb(223, 227, 235);
`;

export const RowLabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  text-transform: none;
  font-style: normal;
  opacity: 1;  
  color: rgb(103, 113, 133);
  width: 50%;
  padding: 0.8rem 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: auto;
  text-align: left;
  flex-grow: 0;
  flex-shrink: 0;
  width: 50%;
`;

export const RowValue = styled.div` 
  font-size: 14px;
  text-transform: none;
  font-style: normal;
  opacity: 1;  
  color: rgb(53, 63, 82);
  padding: 0.8rem 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: auto;
  text-align: left;
  flex-grow: 0;
  flex-shrink: 0;
  width: 50%;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  margin: 0.5rem 0rem;
  background: rgb(223, 227, 235);
  display: block;
`;
