import React from "react";

export const OAuth = props => {
  const scopes = "user-library-read";
  const redirect_uri =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/callback/"
      : "https://audioforma.now.sh/callback/";
  const spotifyKey = process.env.REACT_APP_spotifyKey;
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize/?client_id=${spotifyKey}&response_type=token&redirect_uri=${encodeURI(
    redirect_uri
  )}&scope=${scopes}`;

  return (
    <nav className="login">
      <h2>Authenticate with Spotify</h2>
      <p>If you use Spotify, we can visualize your song library for you.</p>
      <button
        className="spotify"
        onClick={() => {
          window.location = spotifyAuthUrl;
        }}
      >
        Show me my Spotify Library!
      </button>
      <button
        className="noThanks"
        onClick={() => {
          window.location.hash = "public";
        }}
      >
        No Thanks
      </button>
    </nav>
  );
};
