import type { Component } from "solid-js";

import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./components/Home";

const App: Component = () => {
  return (
    <>
      <Home />
    </>
  );
};

export default App;
