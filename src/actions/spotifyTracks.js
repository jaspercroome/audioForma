import songs from "../songs";
import SpotifyWebApi from "spotify-web-api-js";

const starterSongs = songs;

export const getTracks = async store => {
  const token = store.state.token;
  const newTracks = [{ ...store.state.tracks }];
  let spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  try {
    const data = await // spotify.getMySavedTracks() ||
    spotify.getTracks(starterSongs);
    for (let track of data["tracks"]) {
      newTracks.push(track);
    }
    store.setState({ tracks: newTracks });
    console.log("tracks!");
  } catch (error) {
    console.log(error);
  }
};
