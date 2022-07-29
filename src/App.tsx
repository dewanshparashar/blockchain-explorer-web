import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import "./App.css";

import BlockDetails from "./components/BlockDetails";
import BlockList from "./components/BlockList";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: auto;
  max-width: 1000px;
  padding: 1rem 2rem;
`;

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/blocks" />} />
          <Route path="/blocks" element={<BlockList />} />
          <Route path="/block/:id" element={<BlockDetails />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
