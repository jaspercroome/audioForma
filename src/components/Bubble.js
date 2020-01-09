import React, { useEffect } from "react";
import useGlobal from "../store";
import { Group } from "@vx/group";
import { Circle } from "@vx/shape";
import { scaleLinear } from "@vx/scale";
// import { withTooltip, Tooltip } from "@vx/tooltip";

const Bubble = (store, props) => {
  const width = window.innerWidth * 0.98;
  const height = window.innerHeight * 0.98;

  const [globalState, globalActions] = useGlobal();

  const xScale = scaleLinear({
    domain: [0, 1],
    range: [0, width],
    clamp: true
  });
  const yScale = scaleLinear({
    domain: [0, 1],
    range: [height, 0],
    clamp: true
  });
  // let tooltipTimeout;

  const spotifyFetch = () => {
    globalActions.spotifyToken.getToken();
  };
  const spotifyAudioFeatures = () => {
    globalActions.spotifyAudioFeatures.getAF();
  };
  const spotifyPlaylists = () => {
    globalActions.spotifyPlaylists.getPlaylists();
  };
  const spotifyTracks = () => {
    globalActions.spotifyTracks.getTracks();
  };
  const token = globalState.token;

  spotifyFetch();
  useEffect(() => {
    spotifyAudioFeatures();
    spotifyPlaylists();
    spotifyTracks();
    // spotifyArtists();
  }, [token]);

  const [bubbles] = [globalState.audioFeatures];
  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} />
        <Group>
          {bubbles.map((track, i) => {
            const cx = xScale(track.valence);
            const cy = yScale(track.danceability);
            const r = 14;
            return (
              <Circle
                key={`track-${track.id}`}
                className="dot"
                cx={cx}
                cy={cy}
                r={r}
                fill="#f6c431"
              />
            );
          })}
        </Group>
      </svg>
    </div>
  );
};
export default Bubble;
