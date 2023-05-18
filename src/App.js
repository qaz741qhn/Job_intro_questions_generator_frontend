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
      : "https://job-application-backend.herokuapp.com";

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/history" element={<HistoryList apiURL={apiURL} />} />
          <Route path="/" element={<InputForm apiURL={apiURL} />} />
          {console.log("Current environment: ", process.env.NODE_ENV)}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
