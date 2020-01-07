import React, { useEffect } from "react";
import spotifyAudioFeatures from "./spotifyAudioFeatures";
import spotifyTracks from "./spotifyTracks";
import spotifyPlaylists from "./spotifyPlaylists";

function SpotifyFetch(props) {
  const token = props.token;

  useEffect(() => {
    spotifyTracks();
    spotifyAudioFeatures();
    spotifyPlaylists();
  });

  return <p>Loading Data</p>;
}

export default SpotifyFetch;
