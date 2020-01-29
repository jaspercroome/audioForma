import React, { useState } from "react";

import Button from "@material-ui/core/Button";

import request from "request";
import { useEffect } from "react";

export default function GetToken(props) {
  const [token, setToken] = useState(props.token);
  const { handleToken } = props;
  const client_id = process.env.REACT_APP_spotifyKey;
  const client_secret = process.env.REACT_APP_spotifySecretKey;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64")
    },
    form: {
      grant_type: "client_credentials"
    },
    json: true
  };

  const response = () => {
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        setToken(
          "#token=" +
            body["access_token"] +
            "&" +
            body["token_type"] +
            "&" +
            body["expires_in"] +
            "&" +
            body["scope"]
        );
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
      No Thanks
    </Button>
  );
}
