import { forceSimulation, forceCollide, forceY, forceX } from "d3-force";

export const simulation = async (tracks, sortBy, radius, xScale, yScale) => {
  const tempData = tracks;

  const move = forceSimulation()
    .force(
      "x",
      forceX(d => {
        return sortBy === "popularity"
          ? xScale(d["trackData"][sortBy])
          : xScale(d["afData"][sortBy]);
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
        return d["trackData"]["preview_url"] ? radius * 2 : radius * 0.7;
      }).iterations(1)
    );
  move.nodes(tempData).on("tick", d3Data => {
    return d3Data;
  });
  move.tick(10);
};
