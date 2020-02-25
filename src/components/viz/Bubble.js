import React, { useContext, useState } from "react";

import _ from "lodash";

import { nest } from "d3-collection";
import { ascending, mean } from "d3-array";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import { forceSimulation, forceCollide, forceY, forceX } from "d3-force";

import { Text } from "@vx/text";
import { Group } from "@vx/group";
import { Circle, LinePath } from "@vx/shape";
import { withTooltip, Tooltip } from "@vx/tooltip";

import { motion } from "framer-motion";

import { spotifyTracks } from "../../actions";
// import rainbowScale from "./rainbowScale";
import SortFormControl from "../controls/SortFormControl";
import GroupFormControl from "../controls/GroupFormControl";
import { TrackContext } from "../context/DataContext";

const Bubble = props => {
  const [tempData, setTempData] = useContext(TrackContext);
  const [tracks, setTracks] = useState([]);
  const [d3Data, setD3Data] = useState([]);
  const [d3Status, setD3Status] = useState("Not Started");

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [margin, setMargin] = useState(0);
  const [sortBy, setSortBy] = useState("valence");
  const [sortByDomain, setSortByDomain] = useState([0, 1]);
  const [groupBy, setGroupBy] = useState("tracks");

  const tempWidth = window.innerWidth;
  const tempHeight = window.innerHeight;

  useEffect(setMargin({
    top: tempHeight * 0.2,
    bottom: tempHeight * 0.2,
    left: tempWidth * 0.0,
    right: tempWidth * 0.0
  }),
  setWidth(tempWidth - (margin.left + margin.right))
  setHeight(tempHeight - (margin.top + margin.bottom)),[tempData])

  const xScale = scaleLinear()
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

  if (d3Status === "pending") {
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
      setD3Data(tracks);
    });
    setD3Status("Completed");
  }

  const handleSortByChange = sortBy => {
    setSortBy(sortBy);

    switch (sortBy) {
      case "loudness":
        setSortByDomain([-60, 0]);
        break;
      case "popularity":
        setSortByDomain([0, 100]);
        break;
      case "tempo":
        setSortByDomain([0, 240]);
        break;
      default:
        setSortByDomain([0, 1]);
    }
    setD3Status("pending");
  };

  const handleGroupByChange = groupBy => {
    setGroupBy(groupBy);
    setD3Status("pending");

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

        setTracks(data);
        console.log(data);
      }
    }
  };

  setD3Data(Array.from(tracks));

  const finalRadius = radius(height, width, d3Data.length);
  const axisY = height * 0.9;

  let tooltipTimeout;

  //Color Scale
  var lookup = {};
  var artistArray = [];

  for (var item, i = 0; (item = d3Data[i++]); ) {
    var name = groupBy === "track" ? item["artists"][0]["name"] : item;

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
        Click Here for more details on Spotify's definition of {sortBy}
      </a>
      <svg width={width} height={height}>
        <Group>
          {d3Data.map((item, i) => {
            const sortByValue = item[sortBy];
            const primaryArtist =
              groupBy === "track" ? item["artists"][0]["name"] : item["key"];
            const songTitle = groupBy === "track" ? item["name"] : item["key"];
            const id = item["id"];
            const cx = item["x"];
            const cy = item["y"];
            const r = finalRadius;
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
                  props.showTooltip({
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
                    props.hideTooltip();
                  }, 300);
                }}
                onTouchStart={event => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  props.showTooltip({
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
      {props.tooltipOpen && (
        <Tooltip left={props.tooltipLeft} top={props.tooltipTop}>
          <div>
            <strong>{props.tooltipData.songTitle}</strong>
            {" | "}
            {props.tooltipData.primaryArtist}
          </div>
          <div>
            <strong>{props.tooltipData.sortBy}</strong>
            {" | "}
            {props.tooltipData.sortByValue}
          </div>
        </Tooltip>
      )}
      <SortFormControl
        sortBy={sortBy}
        handleSortByChange={handleSortByChange}
      />
      {/* <GroupFormControl
            groupBy={state.groupBy}
            handleGroupByChange={this.handleGroupByChange}
          /> */}
    </div>
  );
};
export default withTooltip(Bubble);
