import React, { useEffect, useRef, Component } from "react";
import PropTypes from "prop-types";
import { spotifyToken, spotifyTracks, forceCollide } from "../actions";
// import rainbowScale from "./rainbowScale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal } from "d3-scale";
// import { select } from "d3-selection";
import { Group } from "@vx/group";
import { Circle } from "@vx/shape";

class Bubble extends Component {
  state = {
    width: window.innerWidth * 0.75,
    height: window.innerHeight * 0.9,
    token: "",
    tracks: {},
    d3Data: {}
  };
  constructor(props) {
    super(props);
    this.state = {
      token: window.location.hash.split("=", 2)[1].split("&", 1)[0]
    };
  }

  componentDidMount() {
    spotifyTracks.getTracks(this.state.token).then(tracks => {
      this.setState({ tracks: tracks });
    });
  }
  componentDidUpdate() {
    forceCollide.simulation(this.state.tracks).then(data => {
      // this.setState({ d3Data: data });
      console.log(data);
    });
  }

  render() {
    const width = window.innerWidth * 0.75;
    const height = window.innerHeight * 0.9;
    const d3Data = this.state.d3Data;
    const color = scaleSequential(interpolateRainbow);
    const artistScale = [];

    return (
      <div>
        <svg width={width} height={height}>
          <Group>
            {/* {d3Data.map((track, i) => {
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
            })} */}
          </Group>
        </svg>
      </div>
    );
  }
}
export default Bubble;
