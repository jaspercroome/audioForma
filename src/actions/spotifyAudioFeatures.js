import songs from "../songs";
import SpotifyWebApi from "spotify-web-api-js";

const starterSongs = songs;

export const SpotifyAudioFeatures = store => {
  const token = store.state.token;
  const newAudioFeatures = { ...store.state.audioFeatures };
  var spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  spotify
    .getAudioFeaturesForTracks(starterSongs)
    .then(data => {
      newAudioFeatures.push(data["audio_features"]);
      store.setState({ audioFeatures: newAudioFeatures });
    })
    .catch(error => {
      console.log(error);
    });
};
