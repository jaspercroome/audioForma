import React from "react";
import PropTypes from "prop-types";
import Oauth from "./oAuth";
// import SpotifyFetch from "./SpotifyFetch";
// import Songs from "../songs";

class App extends React.Component {
  state = {
    songs: {},
    audioFeatureData: {},
    artistData: {},
    songData: {}
  };

  static propTypes = {
    match: PropTypes.object
  };

  componentDidMount() {
  }

  componentDidUpdate() {}

  render() {
    return (
      <div>
        <div>
          <h1>AudioForma</h1>
        </div>
        <div>
          <Oauth />
        </div>
      </div>
    );
  }
}

export default App;
