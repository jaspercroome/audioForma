import { forceSimulation, forceCollide, forceY, forceX } from "d3-force";
import { scaleLinear } from "d3-scale";

export const simulation = async tracks => {
  const width = window.innerWidth * 0.75;
  const height = window.innerHeight * 0.9;
  const items = tracks;

  const xScale = scaleLinear([0, 1],[0, width])
  const yScale = scaleLinear([0, 1],[height, 0])

  const move = forceSimulation()
    .force(
      "x",
      forceX(d => {
        return xScale(d["valence"]);
      }).strength(0.5)
    )
    .force(
      "y",
      forceY(d => {
        return yScale(0.5);
      }).strength(0.5)
    )
    .force(
      "collide",
      forceCollide(d => {
        return 25;
      }).iterations(5)
    );
  move.nodes(items);

  return items;
};
