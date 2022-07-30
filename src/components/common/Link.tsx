import { Link as RouteLink } from "react-router-dom";
import styled from "styled-components";

const Link = styled(RouteLink)`
  font-weight: 500;
  font-size: 14px;
  text-transform: none;
  font-style: normal;
  opacity: 1;
  cursor: pointer;
  text-decoration: none;
  color: rgb(12, 108, 242);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
`;

export default Link;
