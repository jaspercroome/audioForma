import React from "react";
import { OAuth } from "./oAuth";
import Bubble from "./Bubble";
import CssBaseline from "@material-ui/core/CssBaseline";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <h1>AudioForma</h1>
        {window.location.hash ? (
          <React.Fragment>
            <Bubble />
          </React.Fragment>
        ) : (
          <OAuth />
        )}
      </React.Fragment>
    );
  }
}

export default App;
