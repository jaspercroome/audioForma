import React, { useEffect, useRef, Component } from "react";
import PropTypes from "prop-types";
import useGlobal from "../store";
import { spotifyToken, spotifyTracks } from "../actions";
// import rainbowScale from "./rainbowScale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal } from "d3-scale";
// import { select } from "d3-selection";
import { Group } from "@vx/group";
import { Circle } from "@vx/shape";
import { forceCollide } from "d3-force";

class Bubble extends Component {
  state = {
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.9,
    token: "",
    tracks: {}
  };

  componentWillMount() {
    spotifyToken.getToken().then(token => {
      this.setState({ token: token });
    });
  }
  componentDidUpdate() {
    const token = this.state.token;
    spotifyTracks.getTracks(token).then(tracks => {
      this.setState({ tracks: tracks });
      forceCollide(tracks);
    });
  }

  render() {
    const width = "";
    const height = "";
    const d3Data = [];
    const color = "";
    const artistScale = "";

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
  }
}
export default Bubble;
