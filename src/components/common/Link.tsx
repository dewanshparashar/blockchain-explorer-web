import { Link as RouteLink } from "react-router-dom";
import styled from "styled-components";

const Link = styled(RouteLink)`
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

export default Link;
