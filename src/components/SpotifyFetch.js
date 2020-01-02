import React, { useState } from "react";
import oAuth from "./oAuth";

const SpotifyFetch = () => {
  return (
    <nav className="login">
      <h2>Authenticate with Spotify</h2>
      <p>If you use Spotify, we can visualize your song library for you.</p>
      <button className="spotify" onClick={oAuth()}>
        Show me my Spotify Library!
      </button>
      <button className="noThanks">No Thanks</button>
    </nav>
  );
};

export default SpotifyFetch;
