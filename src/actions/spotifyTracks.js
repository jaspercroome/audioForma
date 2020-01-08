import React from "react";
import songs from "../songs";
import SpotifyWebApi from "spotify-web-api-js";

const starterSongs = songs;

export const SpotifyTracks = store => {
  const token = { ...store.state.token };
  const newTracks = { ...store.state.tracks };
  var spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  spotify.getTracks(starterSongs).then(data => {
    store.setState({ tracks: newTracks });
  });
};
