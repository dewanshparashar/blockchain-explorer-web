import styled from "styled-components";

const Button = styled.button`
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

export default Button;
