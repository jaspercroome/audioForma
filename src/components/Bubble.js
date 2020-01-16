import React, { useEffect, useRef } from "react";
import useGlobal from "../store";
// import rainbowScale from "./rainbowScale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal } from "d3-scale";
// import { select } from "d3-selection";
import { Group } from "@vx/group";
import { Circle } from "@vx/shape";

const Bubble = (store, props) => {
  const width = window.innerWidth * 0.75;
  const height = window.innerHeight * 0.9;
  const [globalState, globalActions] = useGlobal();

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

  const artistScale = scaleOrdinal()
    .domain(artistArray)
    .range(artistIndexArray);
  //

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
  var d3Data = [globalState.d3Data] || [""];

  const simulation = () => {
    globalActions.forceCollide.simulation();
  };

  component;

  useEffect(() => {
    spotifyFetch();
  }, [props]);

  useEffect(() => {
    token !== ""
      ? // spotifyPlaylists();
        spotifyTracks()
      : console.log("waiting");
  }, [token]);

  useEffect(() => {
    globalState.status === "loaded" ? simulation() : console.log("waiting");
  }, [bubbles]);

  return (
    <div>
      <svg width={width} height={height}>
        <Group>
          {d3Data.map((track, i) => {
            const cx = track["x"];
            const cy = track["y"];
            const r = (0.5 / 100) * width; // equivalent of .5vw
            const fill = color(artistScale(track["artists"][0]["name"]));
            return (
              <Circle
                key={`point-${track["id"]}-${track["name"]}`}
                className="dot"
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
              />
            );
          })}
        </Group>
      </svg>
    </div>
  );
};
export default Bubble;
