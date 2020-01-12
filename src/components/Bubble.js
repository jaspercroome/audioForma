import React, { useEffect } from "react";
import useGlobal from "../store";
import { Group } from "@vx/group";
import { Circle } from "@vx/shape";
import { scaleLinear, scaleOrdinal } from "@vx/scale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential } from "d3-scale";
import { forceSimulation, forceCollide, forceY, forceX } from "d3-force";
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

  //Color Scale
  var lookup = {};
  var artistArray = [];

  for (var item, i = 0; (item = globalState.trackData[i++]); ) {
    var name = item["artists"][0]["name"];

    if (!(name in lookup)) {
      lookup[name] = 1;
      artistArray.push(name);
    }
  }
  var artistIndexArray = [];
  // map the artist index to a matching array, for the range in the color scale.
  for (i = 0; i < artistArray.length; i++) {
    artistIndexArray.push(i / artistArray.length);
  }
  const color = scaleSequential(interpolateRainbow);

  const artistScale = scaleOrdinal({
    domain: artistArray,
    range: artistIndexArray,
    clamp: true
  });
  //

  // let tooltipTimeout;

  const spotifyFetch = () => {
    globalActions.spotifyToken.getToken();
  };
  const spotifyPlaylists = () => {
    globalActions.spotifyPlaylists.getPlaylists();
  };
  const spotifyTracks = () => {
    globalActions.spotifyTracks.getTracks();
  };
  const token = globalState.token;
  const [bubbles] = [globalState.trackData];

  useEffect(() => {
    spotifyFetch();
  }, [props]);

  useEffect(() => {
    spotifyPlaylists();
    spotifyTracks();
  }, [token]);

  useEffect(() => {
    simulation.nodes(bubbles);
  }, [globalState.trackData]);

  const simulation = forceSimulation()
    .force(
      "x",
      forceX(d => {
        return xScale(d["valence"]);
      })
    )
    .force(
      "y",
      forceY(d => {
        return yScale(0.5);
      })
    )
    .force(
      "collide",
      forceCollide(d => {
        return (0.5 / 100) * width + 5;
      })
    );

  // simulation.nodes(bubbles);

  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} />
        {/* <Pack root={bubbles} size={[width,height]}> */}
        <Group>
          {bubbles.map((track, i) => {
            const cx = track.x;
            const cy = track.y;
            const fill = color(artistScale(track["artists"][0]["name"]));
            // const r = 14;
            return (
              <Circle
                key={`track-${track["name"]}${track["id"]}`}
                className="dot"
                cx={cx}
                cy={cy}
                r=".5vw"
                stroke="white"
                fill={fill}
              />
            );
          })}
        </Group>
        {/* </Pack> */}
      </svg>
    </div>
  );
};
export default Bubble;
