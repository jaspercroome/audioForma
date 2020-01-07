import { useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const [playlistData, setPlaylistData] = useState({});

const spotifyPlaylists = token => {
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
};

export default spotifyPlaylists;
