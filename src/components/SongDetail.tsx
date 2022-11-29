import { Typography } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { scaleLinear } from "d3-scale";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { useMeydaAnalyzer } from "../hooks/useMeyda";
import { noteLocations } from "../static/constants";
import { SongJSON } from "../static/songs";
import { BillboardWithText } from "./BillboardWithText";

export const SongDetail = (props: { song: SongJSON[string] }) => {
  const { song } = props;
  //set up audio elements for analysis
  const audioRef = useRef<HTMLAudioElement>();
  const audioContext = new AudioContext();
  let audioSource;
  const BUFFER_SIZE = 512;

  const [canVisualize, setCanVisualize] = useState(false);

  const {
    features,
    setAudioContext: setMeydaAnalyzerAudioContext,
    setSource: setMeydaAnalyzerSource,
  } = useMeydaAnalyzer({
    audioContext: null,
    source: null,
    featureExtractors: ["chroma", "spectralCentroid"],
    bufferSize: BUFFER_SIZE,
  });

  useEffect(() => {
    try {
      if (audioRef && audioRef.current) {
        audioSource = audioContext.createMediaElementSource(
          audioRef.current as unknown as HTMLAudioElement
        );
        setMeydaAnalyzerSource(audioSource);
        setMeydaAnalyzerAudioContext(audioContext);
      }
      setCanVisualize(true);
    } catch {
      setCanVisualize(false);
    }
  }, [audioRef.current]);

  // arrays for rendering dots
  const [chromaArray, setChromaArray] = useState<number[][]>([
    new Array(12).fill(0),
  ]);

  const [trailingTenAverage, setTrailingTenAverage] = useState<number[]>(
    new Array(12).fill(0)
  );

  useEffect(() => {
    if (typeof features !== "undefined") {
      const { chroma } = features;
      chromaArray.push(chroma);

      const lastTenChromaItems = chromaArray.filter((item, index) => {
        return index >= chromaArray.length - 11;
      });

      const lastTenTotal = new Array(12).fill(0);
      const lastTenAverage = new Array(12).fill(0);
      lastTenTotal.forEach((note, index) => {
        lastTenChromaItems.forEach((chroma, chromaIndex) => {
          lastTenTotal[index] += chroma[index];
          lastTenAverage[index] = lastTenTotal[index] / 10;
        });
      });
      setTrailingTenAverage(lastTenAverage);
    }
  }, [features, audioContext.currentTime]);

  const rScale = scaleLinear().domain([0.5, 1]).range([0.01, 1]);

  return (
    <div style={{ height: "600px" }}>
      <h2>{song.name}</h2>
      <h4>{song.artists[0].name}</h4>
      {song.preview_url ? (
        <div style={{ height: "400px" }}>
          {canVisualize ? (
          <Canvas>
          {/* <color attach="background" args={["black"]} /> */}
          {trailingTenAverage.map((item, index) => {
            const itemX =
              Math.sin((noteLocations[index].angle / 180) * Math.PI) *
              3 *
              item;
            const itemY =
              Math.cos((noteLocations[index].angle / 180) * Math.PI) *
              3 *
              item;
            return (
              <React.Fragment key={noteLocations[index].note}>
                <mesh position={[itemX, itemY, 0]}>
                  <sphereGeometry args={[rScale(item), 16, 16]} />
                  <meshBasicMaterial
                    color={`hsl(${noteLocations[index].angle}, 70%, 60%)`}
                  />
                </mesh>
                <BillboardWithText
                  text={item > 0 ? noteLocations[index].note : "Press Play!"}
                  position={
                    item > 0 ? [itemX, itemY, rScale(item) + 0.03] : [0, 0, 0]
                  }
                />
              </React.Fragment>
            );
          })}
          <OrbitControls
            enableZoom
            maxDistance={12}
            maxPolarAngle={Math.PI}
            enableDamping
          />
        </Canvas>
          ) : (
            <Typography variant='h2'>
              Try this app on firefox for the full experience!
            </Typography>
          )}
          <audio
            id="detailAudioPlayer"
            controls
            crossOrigin="anonymous"
            src={song.preview_url}
            ref={audioRef as LegacyRef<HTMLAudioElement>}
          />
        </div>
      ) : (
        "no audio preview"
      )}
    </div>
  );
};
