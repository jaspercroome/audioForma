import React, { Component, Fragment } from "react";
// import rainbowScale from "./rainbowScale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import _ from "lodash";

import { Text } from "@vx/text";
import { LinePath } from "@vx/shape";
import { withTooltip, Tooltip } from "@vx/tooltip";

import { motion } from "framer-motion";

import { spotifyTracks, dodge, forceCollide } from "../actions";
import SortFormControl from "./SortFormControl";
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

      const yScale = scaleLinear()
        .domain([0, 1])
        .range([height, 0])
        .clamp(true);

      const radius = (height, width, count) => {
        return _.clamp(
          height > width ? height * (1 / count) * 2 : width * (1 / count) * 2,
          4,
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
        yScale: yScale,
        radius: radius,
        sortBy: sortBy,
        sortByDomain: sortByDomain,
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
      const xScale = this.state.xScale;
      const yScale = this.state.yScale;
      const sortBy = this.state.sortBy;
      const width = this.state.width;
      const height = this.state.height;
      const radius = this.state.radius(height, width, 1000);

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
              forceCollide(tracks, sortBy, radius, xScale, yScale).then(
                this.setState({ d3Data: tracks, d3Status: "completed" })
              );
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
        const width = this.state.width;
        const height = this.state.height;
        const radius = this.state.radius(height, width, tempData.length);

        xScale.domain(sortByDomain);

        tempData.length > 0
          ? forceCollide(tempData, sortBy, radius, xScale, yScale).then(
              this.setState({ d3Data: tempData, d3Status: "completed" })
            )
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

    handleModalChange = (e, data) => {
      const open = this.state.modal.open ? false : true;
      const token = this.state.token;
      const primaryArtist = data["modalData"]["primaryArtist"];
      const songTitle = data["modalData"]["songTitle"];
      const url = data["modalData"]["url"];
      const id = data["modalData"]["id"];
      this.setState({
        modal: {
          open: open,
          artist: primaryArtist,
          title: songTitle,
          url: url,
          id: id,
          token: token
        }
      });
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
      var genreArray = [];

      for (var item, i = 0; (item = d3Data[i++]); ) {
        var name =
          item["artistData"]["genres"] && item["artistData"]["genres"][0];
        if (!(name in lookup)) {
          lookup[name] = 1;
          genreArray.push(name);
        }
      }
      var genreIndexArray = [];
      // map the artist index to a matching array, for the range in the color scale.
      for (i = 0; i < genreArray.length; i++) {
        genreIndexArray.push(i / genreArray.length);
      }
      const color = scaleSequential(interpolateRainbow);

      const genreScale = scaleOrdinal()
        .domain(genreArray)
        .range(genreIndexArray);
      //
      return (
        <div>
          <svg width={width} height={height}>
            {this.state.d3Status !== "completed" ? (
              <Text y={height / 2} x={width / 2} textAnchor={"middle"}>
                {"Generating Visual..."}
              </Text>
            ) : (
              <Fragment>
                <Text y={height * 0.05} x={width / 2} textAnchor={"middle"}>
                  {"Tap on a Bubble to hear a 30 second sample"}
                </Text>
                {d3Data.map((item, i) => {
                  const sortBy = this.state.sortBy;
                  const sortByValue = item["afData"][sortBy];
                  const primaryArtist = item["artistData"]["name"];
                  const primaryGenre =
                    item["artistData"]["genres"] &&
                    item["artistData"]["genres"][0];
                  const songTitle = item["trackData"]["name"];
                  const id = item["trackData"]["id"];
                  const url = item["trackData"]["preview_url"];
                  const cx = item["x"];
                  const cy = axisY - item["y"];
                  const r = url
                    ? radius * 2 * (item["trackData"]["popularity"] / 100)
                    : radius / 2;
                  const fill = url
                    ? color(genreScale(primaryGenre))
                    : "lightgrey";
                  return (
                    <motion.circle
                      positionTransition
                      key={`${songTitle}-${id}`}
                      className="dot"
                      animate={{ cx: cx, cy: cy }}
                      initial={false}
                      r={r}
                      fill={fill}
                      stroke={fill}
                      strokeWidth={"3px"}
                      strokeOpacity="1"
                      opacity=".8"
                      onMouseEnter={event => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        this.props.showTooltip({
                          tooltipLeft: cx,
                          tooltipTop: cy + 20,
                          tooltipData: {
                            primaryArtist: primaryArtist,
                            songTitle: songTitle,
                            primaryGenre: primaryGenre,
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
                            url: url,
                            id: id
                          }
                        });
                      }}
                      onClick={event => {
                        this.handleModalChange(event, {
                          modalData: {
                            primaryArtist: primaryArtist,
                            songTitle: songTitle,
                            url: url,
                            id: id
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
              </Fragment>
            )}
          </svg>
          {this.props.tooltipOpen && (
            <Tooltip left={this.props.tooltipLeft} top={this.props.tooltipTop}>
              <div>
                <strong>{this.props.tooltipData.songTitle}</strong>
                {" | "}
                {this.props.tooltipData.primaryArtist}
              </div>
              <div>{this.props.tooltipData.primaryGenre}</div>
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
          <a
            href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/"
            rel="external noopener noreferrer"
            target="_blank"
          >
            Click Here for more details on Spotify's definition of{" "}
            {this.state.sortBy}
          </a>
        </div>
      );
    }
  }
);
