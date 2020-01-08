import SpotifyWebApi from "spotify-web-api-js";

export const SpotifyPlaylists = store => {
  const token = store.state.token;
  const newPlaylists = { ...store.state.playlists };
  var spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  spotify
    .getUserPlaylists()
    .then(data => {
      newPlaylists.push(data);
      store.setState({ playlists: newPlaylists });
    })
    .catch(error => {
      console.log(error);
    });
};
