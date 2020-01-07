import React from "react";
import PropTypes from "prop-types";
import Oauth from "./oAuth";
import SpotifyFetch from "./SpotifyFetch";
import Bubble from "./Bubble";

class App extends React.Component {
  state = {
    token: window.location.hash
      ? window.location.hash.split("=", 2)[1].split("&", 1)[0]
      : ""
  };

  static propTypes = {
    match: PropTypes.object
  };

  render() {
    return (
      <React.Fragment>
        <h1>AudioForma</h1>
        {this.state.token ? (
          <React.Fragment>
            <SpotifyFetch token={this.state.token} />
            <Bubble data={this.state.audioFeatures} />
          </React.Fragment>
        ) : (
          <Oauth />
        )}
      </React.Fragment>
    );
  }
}

export default App;
