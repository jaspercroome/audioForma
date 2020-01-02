import React, { useState, useEffect } from "react";
import Creds from "../creds";

function OAuth(props) {
  const [oAuthKey, setOAuthKey] = useState("");
  const [oAuthState, setOAuthState] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const spotifyKey = Creds.key;
  //   const spotifySecretKey = Creds.secret_key;
  const scopes = "user-library-read";
  const redirect_uri = "http://localhost:3000/callback/";
  const spotifyAuthUrl = "https://accounts.spotify.com/authorize/?";

  useEffect(() => {
    fetch(
      spotifyAuthUrl +
        "client_id=" +
        spotifyKey +
        "response_type=code" +
        "redirect_uri=" +
        redirect_uri +
        "scope=" +
        scopes,
      {
        method: "GET"
      }
    )
      //   .then(res => res.json())
      .then(res => console.log(res))
      .catch(error => console.log(error));
  });
}
export default OAuth;
