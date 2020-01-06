import React, { useState, useEffect } from "react";
import songs from "../songs";
import SpotifyWebApi from "spotify-web-api-js";

function SpotifyFetch(props) {
  const starterSongs = songs;
  const token = props.token;
  const [savedTracks, setSavedTracks] = useState({});
  const [tracks, setTracks] = useState({});
  const [audioFeatures, setAudioFeatures] = useState([]);
  const [playlistData, setPlaylistData] = useState({});

  const spotifyPlaylists = () => {
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

  const spotifyAudioFeatures = () => {
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

  const spotifyTracks = () => {
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

  useEffect(() => {
    spotifyTracks();
    spotifyAudioFeatures();
    spotifyPlaylists();
  });

  return <p>Loading Data</p>;
}

export default SpotifyFetch;
