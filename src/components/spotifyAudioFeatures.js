import { useState } from "react";
import songs from "../songs";
import SpotifyWebApi from "spotify-web-api-js";

const starterSongs = songs;
const [audioFeatures, setAudioFeatures] = useState([]);

const spotifyAudioFeatures = token => {
  var spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  spotify
    .getAudioFeaturesForTracks(starterSongs)
    .then(data => {
      setAudioFeatures(data["audio_features"]);
    })
    .catch(error => {
      console.log(error);
    });
};

export default spotifyAudioFeatures;
