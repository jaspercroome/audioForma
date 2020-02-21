import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

import Login from "./Login";
import DataSpace from "./DataSpace";
import DataContext from "./DataContext";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <h1>AudioForma</h1>
        {window.location.hash ? <DataContext /> : <Login />}
      </React.Fragment>
    );
  }
}

export default App;
