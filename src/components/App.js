import React from "react";
import { OAuth } from "./oAuth";
import SpotifyFetch from "./SpotifyFetch";
import Bubble from "./Bubble";

function App() {
  return (
    <React.Fragment>
      <h1>AudioForma</h1>
      {window.location.hash ? (
        <React.Fragment>
          {/* <SpotifyFetch /> */}
          <Bubble />
        </React.Fragment>
      ) : (
        <OAuth />
      )}
    </React.Fragment>
  );
}

export default App;
