import React, { useState } from "react";
import request from "request";

export const OAuth = props => {
  const scopes = "user-library-read";
  const [publicToken, setPublicToken] = useState("");
  const redirect_uri =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/callback/"
      : "https://audioforma.now.sh/callback/";
  const spotifyKey = process.env.REACT_APP_spotifyKey;
  const spotifySecretKey = process.env.REACT_APP_spotifySecretKey;
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize/?client_id=${spotifyKey}&response_type=token&redirect_uri=${encodeURI(
    redirect_uri
  )}&scope=${scopes}`;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(spotifyKey + ":" + spotifySecretKey).toString("base64")
    },
    form: {
      grant_type: "client_credentials"
    },
    json: true
  };

  const getClientToken = () => {
    request.post(authOptions, async function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const payload = async () => {
          let data = await body;
          return data;
        };
        payload().then(data => {
          window.spotify.token = data["access_token"];
          window.location.hash = "public";
        });
      }
    });
  };

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
          getClientToken();
        }}
      >
        No Thanks
      </button>
    </nav>
  );
};
