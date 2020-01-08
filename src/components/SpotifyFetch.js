import React from "react";
import useGlobal from "../store";

const SpotifyFetch = () => {
  const [globalState, globalActions] = useGlobal();
  globalActions.spotifyToken.spotifyToken();
  globalActions.spotifyTracks.SpotifyTracks();
  return <p>Loading Data...</p>;
};

export default SpotifyFetch;
