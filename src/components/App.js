import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

import Login from "./Login";
import Bubble from "./Bubble";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <h1>AudioForma</h1>
        {window.location.hash ? <Bubble /> : <Login />}
      </React.Fragment>
    );
  }
}

export default App;
