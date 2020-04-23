//App
//-Bubble
//--AudioSample
//*---detail
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

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
      setTrackAnalysis(data);
      console.log(data);
    });
  }, [props.previewId]);

  useEffect(() => {
    const d3Data = [];
    if (trackAnalysis.length > 0) {
      console.log(trackAnalysis);
      d3Data.push(trackAnalysis);
      setD3Data(d3Data);
    }
  }, [trackAnalysis]);

  return (
    <svg>
      {trackAnalysis.length > 0 ? (
        d3Data.map((obj) => {
          return obj.map((n) => {
            return (
              <circle
                r={parseFloat(n["magnitude"]) * 0.1 + "vw"}
                opacity={".25"}
                key={n["octave"] + "_" + n["note_name"] + "_" + n["note_time"]}
                cx={xScale(parseFloat(n["circle_fifths_X"]))}
                cy={yScale(parseFloat(n["circle_fifths_Y"]))}
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
