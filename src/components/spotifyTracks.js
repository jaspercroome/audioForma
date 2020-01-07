import useState from "react";
import songs from "../songs";
import SpotifyWebApi from "spotify-web-api-js";

const starterSongs = songs;
const [tracks, setTracks] = useState({});

const spotifyTracks = token => {
  var spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  spotify
    .getTracks(starterSongs)
    .then(data => {
      setTracks(data["tracks"]);
    })
    .catch(error => {
      console.log(error);
    });
};

export default spotifyTracks;
