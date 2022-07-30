import styled from "styled-components";

const CORSWarningStyled = styled.div`
  width: 100%;
  background: rgb(12, 108, 242);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  padding: 0.5rem 0rem;
  z-index: 10;
`;

const CorsWarningBanner = () => (
  <CORSWarningStyled>
    Please ensure you have a CORS extension enabled to access the API's.
  </CORSWarningStyled>
);

export default CorsWarningBanner;
