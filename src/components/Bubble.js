import React, { useEffect, useRef } from "react";
import useGlobal from "../store";
// import rainbowScale from "./rainbowScale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleLinear, scaleOrdinal } from "d3-scale";
import { forceSimulation, forceCollide, forceY, forceX } from "d3-force";
import { select } from "d3-selection";

const Bubble = (store, props) => {
  const width = window.innerWidth * 0.75;
  const height = window.innerHeight * 0.9;
  const [globalState, globalActions] = useGlobal();
  const d3BubblesContainer = useRef(null);

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

  const xScale = scaleLinear()
    .domain([0, 1])
    .range([0, width]);
  const yScale = scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

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

  const simulation = forceSimulation()
    .force(
      "x",
      forceX(d => {
        return xScale(d["valence"]);
      })
    )
    .force("y", forceY(yScale(0.5)))
    .force("collide", forceCollide((0.5 / 100) * width + 5));
  simulation.nodes(bubbles);

  useEffect(() => {
    spotifyFetch();
  }, [props]);

  useEffect(() => {
    spotifyPlaylists();
    spotifyTracks();
  }, [token]);

  useEffect(() => {
    if (bubbles.length && d3BubblesContainer.current) {
      console.log(bubbles);

      const svg = select(d3BubblesContainer.current);

      svg
        .append("g")
        .selectAll("circle")
        .data(bubbles, d => d)
        .join(
          enter => enter.append("circle"),
          update =>
            update
              .attr("cx", d => {
                return d.x;
              })
              .attr("cy", d => {
                return d.y;
              }),
          exit => exit.remove()
        )
        .attr("cx", d => {
          return d.x;
        })
        .attr("cy", d => {
          return d.y;
        })
        .attr("r", ".5vw")
        .attr("fill", d => {
          return color(artistScale(d["artists"][0]["name"]));
        });
    }
  }, [bubbles, d3BubblesContainer.current]);

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
