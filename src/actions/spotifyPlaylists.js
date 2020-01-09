import SpotifyWebApi from "spotify-web-api-js";

export const getPlaylists = async store => {
  const token = store.state.token;
  const newPlaylists = [{ ...store.state.playlists }];
  let spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  try {
    const data = await spotify.getUserPlaylists();
    for (let playlist of data["items"]) {
      newPlaylists.push(playlist);
    }
    store.setState({ playlists: newPlaylists });
    console.log("playlists!");
  } catch (error) {
    console.log(error);
  }
};
