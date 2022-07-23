import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import BlockDetails from "./components/BlockDetails";
import BlockList from "./components/BlockList";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/blocks" />} />
          <Route path="/blocks" element={<BlockList />} />
          <Route path="/block/:id" element={<BlockDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
