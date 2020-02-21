import React, { Component } from "react";
import { spotifyTracks } from "../../actions";
// import rainbowScale from "./rainbowScale";
import { nest } from "d3-collection";
import { ascending, mean } from "d3-array";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import { forceSimulation, forceCollide, forceY, forceX } from "d3-force";
import _ from "lodash";

import { Text } from "@vx/text";
import { Group } from "@vx/group";
import { Circle, LinePath } from "@vx/shape";
import { withTooltip, Tooltip } from "@vx/tooltip";

import SortFormControl from "../controls/SortFormControl";
import GroupFormControl from "../controls/GroupFormControl";

export default withTooltip(
  class Bubble extends Component {
    constructor(props) {
      super(props);
      let sortBy = "valence";
      let sortByDomain = [0, 1];
      let groupBy = "";

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

      let xScale = scaleLinear()
        .domain(sortByDomain)
        .range([width * 0.1, width * 0.9])
        .clamp(true);
      const yScale = scaleLinear([0, 1], [height, 0]);

      const radius = (height, width, count) => {
        return _.clamp(
          height > width ? height * (1 / count) * 2 : width * (1 / count) * 2,
          4,
          100
        );
      };

      this.state = {
        d3Status: "Not Started",
        token: "",
        isPublic: "isPublic",
        width: width,
        height: height,
        margin: margin,
        xScale: xScale,
        yScale: yScale,
        radius: radius,
        sortBy: sortBy,
        sortByDomain: sortByDomain,
        groupBy: groupBy,
        tracks: {}
      };
    }

    componentDidMount() {
      const getTracks = () => {
        if (this.state.isPublic) {
          spotifyTracks.getPublicTracks().then(tracks => {
            this.setState({ tracks: tracks });
            this.setState({ d3Status: "pending" });
          });
        }
        if (!this.state.isPublic) {
          spotifyTracks
            .getTracks(this.state.token, this.state.isPublic)
            .then(tracks => {
              this.setState({ tracks: tracks });
              this.setState({ d3Status: "pending" });
            });
        }
      };
      getTracks();
    }

    componentDidUpdate() {
      if (this.state.d3Status === "pending") {
        const tempData = this.state.tracks;
        const xScale = this.state.xScale;
        const yScale = this.state.yScale;
        const sortBy = this.state.sortBy;
        const sortByDomain = this.state.sortByDomain;
        const groupBy = this.state.groupBy;
        const width = this.state.width;
        const height = this.state.height;
        const radius = this.state.radius;

        xScale.domain(sortByDomain);

        const move = forceSimulation()
          .force(
            "x",
            forceX(d => {
              return xScale(d[sortBy]);
            }).strength(0.4)
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
              return radius(height, width, tempData.length) * 1.4;
            }).iterations(10)
          );
        move.nodes(tempData).on("tick", tracks => {
          this.setState({ d3Data: tracks });
        });
        this.setState({ d3Status: "Completed" });
      }
    }

    handleSortByChange = sortBy => {
      this.setState({ sortBy: sortBy });

      switch (sortBy) {
        case "loudness":
          this.setState({ sortByDomain: [-60, 0] });
          break;
        case "popularity":
          this.setState({ sortByDomain: [0, 100] });
          break;
        case "tempo":
          this.setState({ sortByDomain: [0, 240] });
          break;
        default:
          this.setState({ sortByDomain: [0, 1] });
      }
      this.setState({ d3Status: "pending" });
    };

    handleGroupByChange = groupBy => {
      this.setState({ groupBy: groupBy });
      this.setState({ d3Status: "pending" });

      const sortBy = this.state.sortBy;
      const tempData = this.state.tracks;

      switch (groupBy) {
        case "artist": {
          let data = nest()
            .key(d => {
              return d["artists"][0]["name"];
            })
            .sortKeys(ascending)
            .rollup(leaves => {
              return {
                score: mean(leaves, d => {
                  return d[sortBy];
                }),
                size: leaves.length
              };
            })
            .entries(tempData);

          this.setState({ tracks: data });
          console.log(data);
          break;
        }
        default: {
          let data = nest()
            .key(d => {
              return d["id"];
            })
            .sortKeys(ascending)
            .rollup(leaves => {
              return {
                score: mean(leaves, d => {
                  return d[sortBy];
                }),
                size: leaves.length
              };
            })
            .entries(tempData);

          this.setState({ tracks: data });
          console.log(data);
        }
      }
    };

    render() {
      const d3Data = Array.from(this.state.tracks);

      const width = this.state.width;
      const height = this.state.height;
      const radius = this.state.radius(height, width, d3Data.length);
      const axisY = height * 0.9;

      let tooltipTimeout;

      //Color Scale
      var lookup = {};
      var artistArray = [];

      for (var item, i = 0; (item = d3Data[i++]); ) {
        var name =
          this.state.groupBy === "track" ? item["artists"][0]["name"] : item;

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
          <a
            href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/"
            rel="external noopener noreferrer"
            target="_blank"
          >
            Click Here for more details on Spotify's definition of{" "}
            {this.state.sortBy}
          </a>
          <svg width={width} height={height}>
            <Group>
              {d3Data.map((item, i) => {
                const sortBy = this.state.sortBy;
                const sortByValue = item[sortBy];
                const primaryArtist =
                  this.state.groupBy === "track"
                    ? item["artists"][0]["name"]
                    : item["key"];
                const songTitle =
                  this.state.groupBy === "track" ? item["name"] : item["key"];
                const id = item["id"];
                const cx = item["x"];
                const cy = item["y"];
                const r = radius;
                const fill = color(artistScale(primaryArtist));
                return (
                  <Circle
                    key={`${songTitle}-${id}`}
                    className="dot"
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={fill}
                    opacity=".8"
                    onMouseEnter={event => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                      this.props.showTooltip({
                        tooltipLeft: cx,
                        tooltipTop: cy + 20,
                        tooltipData: {
                          primaryArtist: primaryArtist,
                          songTitle: songTitle,
                          sortBy: sortBy,
                          sortByValue: sortByValue
                        }
                      });
                    }}
                    onMouseLeave={event => {
                      tooltipTimeout = setTimeout(() => {
                        this.props.hideTooltip();
                      }, 300);
                    }}
                    onTouchStart={event => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                      this.props.showTooltip({
                        tooltipLeft: cx,
                        tooltipTop: cy - 30,
                        tooltipData: {
                          primaryArtist: primaryArtist,
                          songTitle: songTitle,
                          sortBy: sortBy,
                          sortByValue: sortByValue
                        }
                      });
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
            </Group>
          </svg>
          {this.props.tooltipOpen && (
            <Tooltip left={this.props.tooltipLeft} top={this.props.tooltipTop}>
              <div>
                <strong>{this.props.tooltipData.songTitle}</strong>
                {" | "}
                {this.props.tooltipData.primaryArtist}
              </div>
              <div>
                <strong>{this.props.tooltipData.sortBy}</strong>
                {" | "}
                {this.props.tooltipData.sortByValue}
              </div>
            </Tooltip>
          )}
          <SortFormControl
            sortBy={this.state.sortBy}
            handleSortByChange={this.handleSortByChange}
          />
          {/* <GroupFormControl
            groupBy={this.state.groupBy}
            handleGroupByChange={this.handleGroupByChange}
          /> */}
        </div>
      );
    }
  }
);
