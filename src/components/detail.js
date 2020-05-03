//App
//-Bubble
//--AudioSample
//*---detail
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { transition } from "d3-transition"

import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { line, curveNatural } from "d3-shape"
import { extent } from "d3-array";

import { afMicroServicePost } from "../actions";

export const Detail = (props) => {
  const [previewId, setPreviewId] = useState(props.previewId);
  const [trackAnalysis, setTrackAnalysis] = useState([]);
  const [d3Data, setD3Data] = useState([]);
  // const [rainbowScale, setRainbowScale] = useState(() => {});
  // const [color, setColor] = useState();

  const xScale = scaleLinear().domain([-10, 10]).range([0, 150]).clamp(true);
  const yScale = scaleLinear().domain([10, -10]).range([150, 0]).clamp(true);

  const bigNoiseOnly = d =>{
    return d['magnitude'] >=3
  }

  const songPath = line()
    .curve(curveNatural)
    .x(d=>{return xScale(parseFloat(d["circle_fifths_X"]))})
    .y(d=>{return yScale(parseFloat(d["circle_fifths_Y"]))})

  useEffect(() => {
    setPreviewId(props.previewId);
    afMicroServicePost(previewId).then((data) => {
      const tempData = 
        data
          .filter(bigNoiseOnly)
      setTrackAnalysis(tempData);
    });
  }, [props.previewId]);

  useEffect(() => {
    const d3Data = [];
    if (trackAnalysis.length > 0) {
      d3Data.push(trackAnalysis);
      setD3Data(d3Data[0]);
    }
  }, [trackAnalysis]);

  return (
    <svg>
      {trackAnalysis.length > 0 ? (
        // d3Data.map((obj,i) => {
          // return obj.map((n) => {
          //   const r = parseFloat(n["magnitude"]) * 0.1 + "vw"
          //   const cx = xScale(parseFloat(n["circle_fifths_X"]))
          //   const cy = yScale(parseFloat(n["circle_fifths_Y"]))
          //   const delay = parseFloat(n["note_time"])
            // return (
              // <motion.circle
              //   positionTransition
              //   r={r}
              //   animate={{ cx: cx, cy: cy }}
              //   initial={false}
              //   opacity={".05"}
              //   key={n["octave"] + "_" + n["note_name"] + "_" + n["note_time"]}
              //   fill="black"
              // />
              <motion.path
              key={'line'}
              initial={{ pathLength: 1, pathOffset: 0 }}
              animate={{ pathLength: 0, pathOffset: 1 }}
              transition={{ duration: 30 }}
              d={songPath(d3Data)}
              stroke={"black"}
              strokeWidth={".01vw"}
              opacity={".5"}
              fill={"white"}
              fillOpacity={"0"}
              />
            // );
          // });
        // })
      ) : (
          <p>{"loading..."}</p>
        )}
    </svg>
  );
};
