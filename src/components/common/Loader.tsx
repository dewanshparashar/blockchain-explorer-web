import { TailSpin } from "react-loader-spinner";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 150px auto;
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
