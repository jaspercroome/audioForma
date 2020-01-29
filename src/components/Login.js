import React, { useState } from "react";
import Button from "@material-ui/core/Button";

import GetSpotifyToken from "../actions/GetSpotifyToken";

class Login extends React.Component {
  constructor(props) {
    super(props);
    const scopes = "user-library-read";
    const redirect_uri =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/callback/"
        : "https://audioforma.now.sh/callback/";
    const spotifyKey = process.env.REACT_APP_spotifyKey;
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize/?client_id=${spotifyKey}&response_type=token&redirect_uri=${encodeURI(
      redirect_uri
    )}&scope=${scopes}`;
    this.state = {
      spotifyAuthUrl: spotifyAuthUrl,
      token: ""
    };
  }

  render() {
    return (
      <nav className="login">
        <h2>Authenticate with Spotify</h2>
        <p>If you use Spotify, we can visualize your song library for you.</p>
        <Button
          variant="contained"
          className="spotify"
          color="primary"
          onClick={() => {
            window.location = this.state.spotifyAuthUrl;
          }}
        >
          Show me my Spotify Library
        </Button>
        <GetSpotifyToken token={this.state.token} />
      </nav>
    );
  }
}
export default Login;
