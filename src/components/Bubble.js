import React, { useEffect } from "react";
import { Group } from "@vx/group";
import { Circle } from "@vx/shape";
import { GradientPinkRed } from "@vx/gradient";
import { scaleLinear } from "@vx/scale";
import { genRandomNormalPoints } from "@vx/mock-data";
import { withTooltip, Tooltip } from "@vx/tooltip";

const Bubble = data => {
  const bubbles = [data];
  const width = window.innerWidth;
  const height = window.innerHeight;
  const xScale = scaleLinear({
    domain: [0, 1],
    range: [0, width]
  });
  const yScale = scaleLinear({
    domain: [0, 1],
    range: [height, 0]
  });
  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} />
        <Group>
          {bubbles.map(track => {
            const cx = xScale(track["valence"]);
            const cy = yScale(track["energy"]);
            const r = 1;
            return (
              <Circle
                key={`track-${track["id"]}`}
                className="dot"
                cx={cx}
                cy={cy}
                r={r}
                fill="#f6c431"
              />
            );
          })}
        </Group>
      </svg>
    </div>
  );
};
export default Bubble;
