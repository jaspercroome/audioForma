import React from "react";
import { interpolateRainbow } from "d3-scale-chromatic";
import { scaleSequential, scaleOrdinal } from "d3-scale";

export const rainbowScale = (unit, list) => {
  //Color Scale
  var lookup = {};
  var itemArray = [];
  var itemIndexArray = [];

  for (var item, i = 0; (item = list[i++]); ) {
    var name = item[unit];

    if (!(name in lookup)) {
      lookup[name] = 1;
      itemArray.push(name);
    }
  }
  // map the artist index to a matching array, for the range in the color scale.
  for (i = 0; i < itemArray.length; i++) {
    itemIndexArray.push(i / itemArray.length);
  }
  const color = scaleSequential(interpolateRainbow);
  const itemScale = scaleOrdinal({
    domain: itemArray,
    range: itemIndexArray,
    clamp: true
  });

  return { color, itemScale };
};
