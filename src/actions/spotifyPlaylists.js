import { useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

export const SpotifyPlaylists = token => {
  const [playlistData, setPlaylistData] = useState({});
  var spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  spotify
    .getUserPlaylists()
    .then(data => {
      setPlaylistData(data);
    })
    .catch(error => {
      console.log(error);
    });
  console.log("Playlists");
};
