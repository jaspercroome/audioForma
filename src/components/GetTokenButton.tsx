import React, { useState, useEffect } from "react";

import { Button } from "@mui/material";

import request from "request";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../static/constants";

export const GetTokenButton = () => {
  console.log(process.env)
  const [token, setToken] = useState();
  
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: headers,
    form: {
      grant_type: "client_credentials"
    },
    json: true
  };

  const response = () => {
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        setToken("#token=" + body["access_token"] + "&public");
      }
    });
  };

  useEffect(() => {
    window.location.hash = token;
  }, [token]);
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => {
        response();
      }}
    >
      Show me 1000 Random Songs!
    </Button>
  );
}