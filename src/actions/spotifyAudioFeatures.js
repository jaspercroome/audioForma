import songs from "../songs";
import SpotifyWebApi from "spotify-web-api-js";

const starterSongs = songs;

export const getAF = async store => {
  const token = store.state.token;
  const newAudioFeatures = [{ ...store.state.audioFeatures }];
  let spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  try {
    const data = await spotify.getAudioFeaturesForTracks(starterSongs);
    for (let af of data["audio_features"]) {
      newAudioFeatures.push(af);
    }
    store.setState({ audioFeatures: newAudioFeatures });
    console.log("Audio Features!");
  } catch (error) {
    console.log(error);
  }
};
