import songs from "../songs";
import SpotifyWebApi from "spotify-web-api-js";

const starterSongs = songs;

export const spotifyTracks = async (store) => {
  // const token = store.state.token;
  const newTracks = [];
  var spotify = new SpotifyWebApi();
  spotify.setAccessToken(store.state.token);
  // try {
  // //   // const data = await spotify.getTracks(starterSongs)
  //   const data = await ['1','2','3']
  //   newTracks.push(data)
  //   store.setState({ tracks: newTracks });
  //   }
  // catch (error) {
  //   console.log(error);
  // }
    console.log('tracks!')
};
