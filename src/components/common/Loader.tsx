import { TailSpin } from "react-loader-spinner";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Loader = () => {
  return (
    <Container>
      <TailSpin
        height="80"
        width="80"
        color="rgb(12, 108, 242)"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </Container>
  );
};

export default Loader;
