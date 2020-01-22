import React, { Component } from "react";
import { spotifyTracks } from "../actions";
// import rainbowScale from "./rainbowScale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import { forceSimulation, forceCollide, forceY, forceX } from "d3-force";

import { AxisBottom } from "@vx/axis";
import { Group } from "@vx/group";
import { Circle, LinePath } from "@vx/shape";

import FormControl from "./FormControl";

class Bubble extends Component {
  constructor(props) {
    super(props);
    const token = window.location.hash.split("=", 2)[1].split("&", 1)[0];
    const tempWidth = window.innerWidth;
    const tempHeight = window.innerHeight;
    const margin = {
      top: tempHeight * 0.2,
      bottom: tempHeight * 0.2,
      left: tempWidth * 0.0,
      right: tempWidth * 0.0
    };
    const width = tempWidth - (margin.left + margin.right);
    const height = tempHeight - (margin.top + margin.bottom);
    const xScale = scaleLinear([0, 1], [0, width]);
    const yScale = scaleLinear([0, 1], [height, 0]);
    const sortBy = "valence";

    // const sortBy = this.props.sortBy;

    this.state = {
      d3Status: "Not Started",
      token: token,
      width: width,
      height: height,
      margin: margin,
      xScale: xScale,
      yScale: yScale,
      sortBy: sortBy,
      tracks: {}
    };
  }

  componentDidMount() {
    const getTracks = token => {
      spotifyTracks.getTracks(this.state.token).then(tracks => {
        this.setState({ tracks: tracks });
        this.setState({ d3Status: "pending" });
      });
    };
    getTracks();
  }

  componentDidUpdate() {
    if (this.state.d3Status === "pending") {
      const data = this.state.tracks;
      const xScale = this.state.xScale;
      const yScale = this.state.yScale;
      const sortBy = this.state.sortBy;
      const width = this.state.width;
      const height = this.state.height;

      const radius = (height, width) => {
        return height > width ? height * 0.1 : width * 0.1;
      };

      const move = forceSimulation()
        .force(
          "x",
          forceX(d => {
            return xScale(d[sortBy]);
          }).strength(0.1)
        )
        .force(
          "y",
          forceY(d => {
            return yScale(0.5);
          }).strength(0.1)
        )
        .force(
          "collide",
          forceCollide(d => {
            return (1.2 / 100) * width;
          }).iterations(10)
        );
      move.nodes(data).on("tick", tracks => {
        this.setState({ d3Data: tracks });
      });
      this.setState({ d3Status: "Completed" });
    }
  }

  handleSortByChange = sortBy => {
    this.setState({ sortBy: sortBy });
    this.setState({ d3Status: "pending" });
  };

  render() {
    const width = this.state.width;
    const height = this.state.height;
    const d3Data = Array.from(this.state.tracks);

    //Color Scale
    var lookup = {};
    var artistArray = [];

    for (var item, i = 0; (item = d3Data[i++]); ) {
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

    return (
      <div>
        <svg width={width} height={height}>
          <Group>
            if (this.state.d3Status !== 'Completed')
            {d3Data.map((track, i) => {
              const cx = track["x"];
              const cy = track["y"];
              const r = (1 / 100) * width; // equivalent of .5vw
              const fill = color(artistScale(track["artists"][0]["name"]));
              return (
                <Circle
                  key={`point-${track["id"]}-${track["name"]}`}
                  className="dot"
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fill}
                  opacity=".8"
                />
              );
            })}
          </Group>
        </svg>
        <FormControl
          sortBy={this.state.sortBy}
          handleSortByChange={this.handleSortByChange}
        />
      </div>
    );
  }
}
export default Bubble;
