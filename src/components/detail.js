//App
//-Bubble
//--AudioSample
//*---detail
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { transition } from "d3-transition"

import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import { interpolateRainbow } from "d3-scale-chromatic";
// import { extent } from "d3-array";

import { afMicroServicePost } from "../actions";

export const Detail = (props) => {
  const [previewId, setPreviewId] = useState(props.previewId);
  const [trackAnalysis, setTrackAnalysis] = useState([]);
  const [d3Data, setD3Data] = useState([]);
  // const [rainbowScale, setRainbowScale] = useState(() => {});
  // const [color, setColor] = useState();

  const xScale = scaleLinear().domain([-10, 10]).range([0, 300]).clamp(true);
  const yScale = scaleLinear().domain([10, -10]).range([150, 0]).clamp(true);

  useEffect(() => {
    setPreviewId(props.previewId);
    afMicroServicePost(previewId).then((data) => {
      const tempData = data.slice(0, 5000)
      setTrackAnalysis(tempData);
    });
  }, [props.previewId]);

  useEffect(() => {
    const d3Data = [];
    if (trackAnalysis.length > 0) {
      d3Data.push(trackAnalysis);
      setD3Data(d3Data);
    }
  }, [trackAnalysis]);

  return (
    <svg>
      {trackAnalysis.length > 0 ? (
        d3Data.map((obj) => {
          return obj.map((n) => {
            const r = parseFloat(n["magnitude"]) * 0.1 + "vw"
            const cx = xScale(parseFloat(n["circle_fifths_X"]))
            const cy = yScale(parseFloat(n["circle_fifths_Y"]))
            const delay = parseFloat(n["note_time"])
            return (
              <motion.circle
                positionTransition
                r={r}
                animate={{ cx: cx, cy: cy }}
                initial={false}
                opacity={".05"}
                key={n["octave"] + "_" + n["note_name"] + "_" + n["note_time"]}
                fill="black"
              />
            );
          });
        })
      ) : (
          <p>{"loading..."}</p>
        )}
    </svg>
  );
};
