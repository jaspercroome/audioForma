import React, { Component } from "react";
// import rainbowScale from "./rainbowScale";
import { nest } from "d3-collection";
import { ascending, mean } from "d3-array";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import _ from "lodash";

import { Text } from "@vx/text";
import { Group } from "@vx/group";
import { Circle, LinePath } from "@vx/shape";
import { withTooltip, Tooltip } from "@vx/tooltip";

import { motion } from "framer-motion";

import { spotifyTracks, dodge } from "../actions";
import SortFormControl from "./SortFormControl";
// import GroupFormControl from "./GroupFormControl";
import AudioSample from "./AudioSample";

export default withTooltip(
  class Bubble extends Component {
    constructor(props) {
      super(props);
      const token = window.location.hash.split("=", 2)[1].split("&", 1)[0];
      const isPublic =
        window.location.hash.split("=", 2)[1].split("&", 2)[1] === "public"
          ? true
          : false;
      let sortBy = "valence";
      let sortByDomain = [0, 1];
      // let groupBy = isPublic ? "artist" : "track";

      const tempWidth = window.innerWidth;
      const tempHeight = window.innerHeight;
      const margin = {
        top: tempHeight * 0.15,
        bottom: tempHeight * 0.15,
        left: tempWidth * 0.0,
        right: tempWidth * 0.0
      };
      const width = tempWidth - (margin.left + margin.right);
      const height = tempHeight - (margin.top + margin.bottom);

      let xScale = scaleLinear()
        .domain(sortByDomain)
        .range([width * 0.1, width * 0.9])
        .clamp(true);

      // const yScale = scaleLinear()
      //   .domain([0, 1])
      //   .range([height, 0])
      //   .clamp(true);

      const radius = (height, width, count) => {
        return _.clamp(
          height > width ? height * (1 / count) * 2 : width * (1 / count) * 2,
          2,
          100
        );
      };

      this.state = {
        d3Data: {},
        d3Status: "Not Started",
        token: token,
        isPublic: isPublic,
        width: width,
        height: height,
        margin: margin,
        xScale: xScale,
        // yScale: yScale,
        radius: radius,
        sortBy: sortBy,
        sortByDomain: sortByDomain,
        // groupBy: groupBy,
        modal: {
          open: false,
          url: "",
          artist: "",
          songTitle: ""
        },
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
        const sortBy = this.state.sortBy;
        const sortByDomain = this.state.sortByDomain;
        // const groupBy = this.state.groupBy;
        const width = this.state.width;
        const height = this.state.height;
        const radius = this.state.radius(height, width, tempData.length);

        xScale.domain(sortByDomain);

        tempData.length > 0
          ? dodge
              .dodge(tempData, radius * 2.1, sortBy, xScale, height)
              .then(tracks => {
                this.setState({ d3Data: tracks });
                this.setState({ d3Status: "Completed" });
              })
          : console.log("waiting for data");
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
    handleModalChange = (e, data) => {
      const open = this.state.modal.open ? false : true;
      const primaryArtist = data["modalData"]["primaryArtist"];
      const songTitle = data["modalData"]["songTitle"];
      const url = data["modalData"]["url"];
      this.setState({
        modal: { open: open, artist: primaryArtist, title: songTitle, url: url }
      });
      console.log(this.state.modal.open);
    };

    render() {
      const d3Data = Array.from(this.state.d3Data);

      const width = this.state.width;
      const height = this.state.height;
      const radius = this.state.radius(height, width, d3Data.length);
      const axisY = height * 0.9;

      let tooltipTimeout;

      //Color Scale
      var lookup = {};
      var artistArray = [];

      for (var item, i = 0; (item = d3Data[i++]); ) {
        var name = item["data"]["artists"][0]["name"];
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
            {this.state.d3Status === "pending" ? (
              <Text y={height / 2} x={width / 2} textAnchor={"middle"}>
                {"Generating Visual..."}
              </Text>
            ) : (
              <Group>
                <Text y={height * 0.05} x={width / 2} textAnchor={"middle"}>
                  {"Tap on a Bubble to hear a 30 second sample"}
                </Text>
                {d3Data.map((item, i) => {
                  const spring = {
                    type: "spring",
                    damping: 20,
                    stiffness: 300
                  };
                  const sortBy = this.state.sortBy;
                  const sortByValue = item["data"][sortBy];
                  const primaryArtist = item["data"]["artists"][0]["name"];
                  const songTitle = item["data"]["name"];
                  const id = item["data"]["id"];
                  const url = item["data"]["preview_url"];
                  const cx = item["x"];
                  const cy = axisY - item["y"];
                  const r = url ? radius * 2 : radius / 2;
                  const fill = url
                    ? color(artistScale(primaryArtist))
                    : "lightgrey";
                  return (
                    <motion.svg
                      key={id}
                      layoutTransition={spring}
                      x={cx - r}
                      y={cy - r}
                      animate={{ x: 100 }}
                    >
                      <Circle
                        key={`${songTitle}-${id}`}
                        className="dot"
                        cx={r * 2}
                        cy={r * 2}
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
                          this.handleModalChange(event, {
                            modalData: {
                              primaryArtist: primaryArtist,
                              songTitle: songTitle,
                              url: url
                            }
                          });
                        }}
                        onClick={event => {
                          this.handleModalChange(event, {
                            modalData: {
                              primaryArtist: primaryArtist,
                              songTitle: songTitle,
                              url: url
                            }
                          });
                        }}
                      />
                    </motion.svg>
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
                  y={axisY * 1.05}
                  x={width * 0.1}
                  textAnchor={"middle"}
                  style={{ fontSize: "2vw" }}
                >
                  {"less"}
                </Text>
                <Text
                  y={axisY * 1.05}
                  x={width * 0.9}
                  textAnchor={"middle"}
                  style={{ fontSize: "2vw" }}
                >
                  {"more"}
                </Text>
              </Group>
            )}
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
          <AudioSample
            modal={this.state.modal}
            handleModalChange={this.handleModalChange}
          />
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
