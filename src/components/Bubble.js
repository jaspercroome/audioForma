import React, { Component } from "react";
import { spotifyTracks } from "../actions";
// import rainbowScale from "./rainbowScale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import { forceSimulation, forceCollide, forceY, forceX } from "d3-force";

import { Text } from "@vx/text";
import { Group } from "@vx/group";
import { Circle, LinePath } from "@vx/shape";

import FormControl from "./FormControl";
import { Tooltip } from "./Tooltip";

class Bubble extends Component {
  constructor(props) {
    super(props);
    const token = window.location.hash.split("=", 2)[1].split("&", 1)[0];
    const isPublic =
      window.location.hash.split("=", 2)[1].split("&", 2)[1] === "public"
        ? true
        : false;
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
    const xScale = scaleLinear([0, 1], [width * 0.1, width * 0.9]);
    const yScale = scaleLinear([0, 1], [height, 0]);

    const radius = (height, width, count) => {
      return height > width
        ? height * (1 / count) * 2
        : width * (1 / count) * 2;
    };

    let sortBy = "valence";
    let toolTipOpacity = 0;
    let toolTipX = width / 2;
    let toolTipY = height / 2;

    this.state = {
      d3Status: "Not Started",
      token: token,
      isPublic: isPublic,
      width: width,
      height: height,
      margin: margin,
      xScale: xScale,
      yScale: yScale,
      radius: radius,
      sortBy: sortBy,
      toolTip: {
        opacity: toolTipOpacity,
        x: toolTipX,
        y: toolTipY,
        primaryArtist: "",
        songTitle: ""
      },
      tracks: {}
    };
  }

  componentDidMount() {
    const getTracks = () => {
      spotifyTracks
        .getTracks(this.state.token, this.state.isPublic)
        .then(tracks => {
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
      const radius = this.state.radius;

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
            return radius(height, width, data.length) * 1.1;
          }).iterations(5)
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

  enterHandler = (event, cx, cy, primaryArtist, songTitle) => {
    this.setState({
      toolTip: {
        opacity: 0.8,
        primaryArtist: primaryArtist,
        x: cx,
        y: cy,
        songTitle: songTitle
      }
    });
  };
  leaveHandler = e => {
    this.setState({
      toolTip: {
        opacity: 0,
        x: 0,
        y: 0
      }
    });
  };

  render() {
    const d3Data = Array.from(this.state.tracks);

    const width = this.state.width;
    const height = this.state.height;
    const radius = this.state.radius(height, width, d3Data.length);
    const axisY = height * 0.9;

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
            {d3Data.map((track, i) => {
              const primaryArtist = track["artists"][0]["name"];
              const songTitle = track["name"];
              const cx = track["x"];
              const cy = track["y"];
              const r = radius;
              const fill = color(artistScale(primaryArtist));
              return (
                <Circle
                  key={`${track["name"]}-${track["id"]}`}
                  className="dot"
                  primaryartist={primaryArtist}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fill}
                  opacity=".8"
                  onMouseEnter={event => {
                    this.enterHandler(event, cx, cy, primaryArtist, songTitle);
                  }}
                  onTouchStart={event => {
                    this.enterHandler(event, cx, cy, primaryArtist, songTitle);
                  }}
                  onMouseLeave={event => {
                    this.leaveHandler(event);
                  }}
                  onTouchEnd={event => {
                    this.leaveHandler(event);
                  }}
                />
              );
            })}
            <LinePath
              data={[width * 0.1, width * 0.9]}
              x={d => {
                return d;
              }}
              y={axisY}
              stroke={"black"}
              strokeWidth={1}
            />
            <Text
              y={axisY * 0.99}
              x={width * 0.1}
              textAnchor={"middle"}
              style={{ fontSize: "2vw" }}
            >
              {"less"}
            </Text>
            <Text
              y={axisY * 0.99}
              x={width * 0.9}
              textAnchor={"middle"}
              style={{ fontSize: "2vw" }}
            >
              {"more"}
            </Text>
            <Tooltip
              x={this.state.toolTip.x}
              y={this.state.toolTip.y}
              opacity={this.state.toolTip.opacity}
              primaryArtist={this.state.toolTip.primaryArtist}
              songTitle={this.state.toolTip.songTitle}
            />
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
