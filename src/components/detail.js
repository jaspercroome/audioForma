//App
//-Bubble
//--AudioSample
//*---detail
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

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
  const colors = ['green','red','blue']

  const xScale = scaleLinear().domain([-10, 10]).range([0, 350]).clamp(true);
  const yScale = scaleLinear().domain([10, -10]).range([350, 0]).clamp(true);

  const bigNoiseOnly = d =>{
    return parseFloat(d['magnitude']) >= 4
  }
  const largestNoises = d =>{
    return parseFloat(d['magnitude']) >= 7 
  }

  const middleNoises = d =>{
    return parseFloat(d['magnitude']) < 7 && parseFloat(d['magnitude']) > 5
  }

  const smallestNoises = d =>{
    return parseFloat(d['magnitude']) <=5 
  }

  const songPath = line()
    .curve(curveNatural)
    .x(d=>{return xScale(parseFloat(d["circle_fifths_X"]))})
    .y(d=>{return yScale(parseFloat(d["circle_fifths_Y"]))})

  const radius = d =>{
    return parseFloat(d['octave'])
  }

  useEffect(() => {
    setPreviewId(props.previewId);
    afMicroServicePost(previewId).then((data) => {
      const tempData = 
        data.filter(bigNoiseOnly)
      setTrackAnalysis(tempData);
    });
  }, [props.previewId]);

  useEffect(() => {
    const tempData = [];
    if (trackAnalysis.length > 0) {
      tempData.push([
        trackAnalysis.filter(largestNoises),
        trackAnalysis.filter(middleNoises),
        trackAnalysis.filter(smallestNoises)
      ]);
      setD3Data(tempData);
    }
  }, [trackAnalysis]);

  return (
    <svg height={'400px'}width={'400px'}>
      {trackAnalysis.length > 0 ? (
        d3Data.map((obj) => {
          return (
            obj.map((n,i) => {
              return (
                <motion.path
                  key={'line'+i}
                  initial={{ pathLength: 0, pathOffset: 1 }}
                  animate={{ pathLength: 1, pathOffset: 0 }}
                  transition={{ duration: 30 }}
                  d={songPath(n)}
                  stroke={colors[i]}
                  strokeWidth={".01vw"}
                  opacity={ 1 / (i + 1) }
                  fill={"white"}
                  fillOpacity={"0"}
                />
              )
            })
              )
            }
          )
      ) : (
          <p>{"loading..."}</p>
        )}
    </svg>
  );
};
