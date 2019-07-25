import React from "react";
import "./App.css";
import MainView from "./js/controller/mainController";
import { serviceConfiguration } from "./configurations/serviceConfiguration";
function App() {
  return (
    <div className="App">
      <MainView serviceConfiguration={serviceConfiguration} />
    </div>
  );
}

export default App;
