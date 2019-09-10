import React from "react";
import "./App.css";
import Home from "../Home";

function App() {
  return (
    <div className="App">
      <p
        style={{
          fontFamily: "sans-serifs",
          color: "green",
          fontSize: "20px"
          // fontWeight: "bold"
        }}
      >
        LOGIN AND SIGNIN FORM
      </p>
      <Home />
    </div>
  );
}

export default App;
