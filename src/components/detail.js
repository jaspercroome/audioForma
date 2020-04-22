import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

import { scaleSequential, scaleOrdinal, scaleLinear } from "d3-scale";
import { interpolateRainbow } from "d3-scale-chromatic";
import { extent } from "d3-array";

import { spotifyAudioAnalysis } from "../actions";
import { afMicroService } from "../actions";

export const Detail = props => {
  const [previewId, setPreviewId] = useState(props.previewId);
  const [trackAnalysis, setTrackAnalysis] = useState([]);
  const [timeRange, setTimeRange] = useState([]);
  const [d3Data, setD3Data] = useState([]);
  const [rainbowScale, setRainbowScale] = useState(() => { });
  const [color, setColor] = useState();

  const xScale = scaleLinear()
    .domain(timeRange)
    .range([0, 300])
    .clamp(true);
  const yScale = scaleLinear()
    .domain([0, 200])
    .range([150, 0])
    .clamp(true);

  const anglePrep = d => {
    return;
  };

  useEffect(() => {
    setPreviewId(props.previewId)
    afMicroService(previewId).then(data => {
      setTrackAnalysis(data);
      console.log(props.previewId)
    });
  }, [props.previewId]);

  useEffect(() => {
    if (trackAnalysis.length > 0) {
      console.log(trackAnalysis);
      const timeRange = extent(
        trackAnalysis.map(d => {
          return d["start"];
        })
      );
      const timbreArray = Array.from(Array(12), (x, i) => i);

      const d3Data = [];

      timbreArray.map((t, i) => {
        return (
          d3Data.push({ timbre: t, values: [] }),
          trackAnalysis.map(s => {
            return t === d3Data[i]["timbre"]
              ? d3Data[i]["values"].push({
                segmentStart: s["start"],
                segmentStrength: s["timbre"][t]
              })
              : null;
          })
        );
      });

      setD3Data(d3Data);
      setTimeRange(timeRange);
    }
  }, [trackAnalysis]);

  return (
    <svg>
      {trackAnalysis.length > 0 ? (
        d3Data.map((obj, i) => {
          return obj["values"].map((seg, j) => {
            return (
              <motion.circle
                r={".1vw"}
                opacity={".25"}
                key={
                  obj["timbre"].toString() +
                  "_" +
                  seg["segmentStart"].toString()
                }
                cx={xScale(seg["segmentStart"])}
                cy={yScale(seg["segmentStrength"])}
                fill={
                  seg["segmentStrength"] > 0
                    ? interpolateRainbow((obj["timbre"] + 1) / 12)
                    : "white"
                }
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
