import React from "react";
import Spotify from "spotify-web-api-js";
import SpotifyWebApi from "spotify-web-api-js";

class SpotifyFetch extends React.Component {
  state = {
    token : this.props.location.hash.split("=",2)[1]
  }
  spotifyApi = new SpotifyWebApi();

  render(){
    return (
    this.state.token
  );
  }
};

export default SpotifyFetch;
