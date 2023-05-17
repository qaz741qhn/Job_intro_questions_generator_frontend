import React from "react";
import Navbar from "./Navbar";
import InputForm from "./InputForm";
import HistoryList from "./HistoryList";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const apiURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://remarkable-lokum-400dc6.netlify.app";

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/history" element={<HistoryList apiURL={apiURL} />} />
          <Route path="/" element={<InputForm apiURL={apiURL} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
