import React, { useEffect, useRef, setState } from "react";
import useGlobal from "../store";
// import rainbowScale from "./rainbowScale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleLinear, scaleOrdinal } from "d3-scale";
import { select } from "d3-selection";

const Bubble = (store, props) => {
  const width = window.innerWidth * 0.75;
  const height = window.innerHeight * 0.9;
  const [globalState, globalActions] = useGlobal();
  const d3BubblesContainer = useRef(null);

  const xScale = scaleLinear()
    .domain([0, 1])
    .range([0, width]);
  const yScale = scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

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
  const d3Data = globalState.d3Data;
  const [bubbles] = [globalState.trackData];

  const simulation = () => {
    globalActions.forceCollide.simulation();
  };

  useEffect(() => {
    spotifyFetch();
  }, [props]);

  useEffect(() => {
    spotifyPlaylists();
    spotifyTracks();
  }, [token]);

  useEffect(() => {
    simulation();
  }, [bubbles]);

  useEffect(() => {
    if (d3Data && d3BubblesContainer.current) {
      console.log(d3Data);

      const svg = select(d3BubblesContainer.current);

      svg
        .append("g")
        .selectAll("circle")
        .data(d3Data, d => d)
        .join(
          enter =>
            enter
              .append("circle")
              .attr("class", "bubble")
              .attr("cx", d => {
                return d["x"];
              })
              .attr("cy", d => {
                return d["y"];
              })
              .attr("r", ".5vw")
              .attr("fill", d => {
                return color(artistScale(d["artists"][0]["name"]));
              })
              .attr("stroke", "white"),
          // update =>
          // update
          //   .attr("cx", d => {
          //     return d["x"];
          //   })
          //   .attr("cy", d => {
          //     return d["y"];
          //   }),
          exit => exit.remove()
        );
    }
  }, [d3Data, d3BubblesContainer.current]);

  return (
    <div>
      <svg
        className="d3-component"
        width={width}
        height={height}
        ref={d3BubblesContainer}
      />
    </div>
  );
};
export default Bubble;
