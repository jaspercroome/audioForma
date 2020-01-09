import React, { useEffect } from "react";
import useGlobal from "../store"
import { Group } from "@vx/group";
import { Circle } from "@vx/shape";
import { GradientPinkRed } from "@vx/gradient";
import { scaleLinear } from "@vx/scale";
import { genRandomNormalPoints } from "@vx/mock-data";
import { withTooltip, Tooltip } from "@vx/tooltip";

const Bubble = store => {
  const [globalState, globalActions] = useGlobal()
  const bubbles = [globalState.audioFeatures];
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

  const spotifyFetch = () =>{ globalActions.spotifyToken.spotifyToken()
}


spotifyFetch()
useEffect(()=>{console.log(globalActions)},[globalState.token])

  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} />
        <Group>
          {bubbles.map(track => {
            const cx = xScale(2);
            const cy = yScale(2);
            const r = 1;
            return (
              <Circle
                key={`track-${2}`}
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
