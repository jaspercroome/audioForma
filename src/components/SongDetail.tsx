import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { scaleLinear } from "d3-scale";
import Meyda from "meyda";
import React, { useEffect, useRef, useState } from "react";
import { useMeydaAnalyzer } from "../hooks/useMeyda";
import { noteLocations } from "../static/constants";
import { SongJSON } from "../static/songs";
import { BillboardWithText } from "./BillboardWithText";

export const SongDetail = (props: { song: SongJSON[string] }) => {
  const { song } = props;
  //set up audio elements for analysis
  const audioRef = useRef<HTMLAudioElement>();
  const [totalTicks, setTotalTicks] = useState(0);
  const audioContext = new AudioContext();
  let audioSource;

  const [chromaArray, setChromaArray] = useState<number[][]>([
    new Array(12).fill(0),
  ]);

  const [trailingTenAverage, setTrailingTenAverage] = useState<number[]>(
    new Array(12).fill(0)
  );

  const BUFFER_SIZE = 512;

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
    if (audioRef && audioRef.current) {
      audioSource = audioContext.createMediaElementSource(
        audioRef.current as unknown as HTMLAudioElement
      );
      setMeydaAnalyzerSource(audioSource);
      setMeydaAnalyzerAudioContext(audioContext);
    }
  }, [audioRef.current]);

  useEffect(() => {
    if (Boolean(features)) {
      setTotalTicks((prior) => prior + 1);
      const { chroma, spectralCentroid } = features;
      chromaArray.push(chroma);
      const lastTenChromaItems = chromaArray.filter((item, index) => {
        return index >= chromaArray.length - 6;
      });
      const lastTenTotal = new Array(12).fill(0);
      const lastTenAverage = new Array(12).fill(0);
      lastTenTotal.forEach((note, index) => {
        lastTenChromaItems.forEach((chroma, chromaIndex) => {
          lastTenTotal[index] += chroma[index];
          lastTenAverage[index] = lastTenTotal[index] / 5;
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
          <Canvas>
            <color attach="background" args={["black"]} />
            {trailingTenAverage.map((item, index) => (
              <>
                <mesh
                  position={[
                    Math.sin(noteLocations[index].angle/ 180 * Math.PI) *
                      3 *
                      item,
                    Math.cos((noteLocations[index].angle /180) * Math.PI) *
                      3 *
                      item,
                    0,
                  ]}
                  key={index}
                  >
                  <sphereGeometry args={[rScale(item), 16, 16]} />
                  <meshBasicMateria
                    color={`hsl(${noteLocations[index].angle}, 70%, 60%)`}
                    />
                </mesh>
                <BillboardWithText
                  text={noteLocations[index].note}
                  position={[
                    Math.sin(noteLocations[index].angle/ 180 * Math.PI) *
                      3 *
                      item,
                    Math.cos((noteLocations[index].angle /180) * Math.PI) *
                      3 *
                      item,
                    rScale(item)+.03,
                  ]}
                />
              </>
            ))}
            <OrbitControls
              enableZoom
              maxDistance={12}
              maxPolarAngle={Math.PI}
              enableDamping
            />
          </Canvas>
          <audio
            id="detailAudioPlayer"
            controls
            crossOrigin="anonymous"
            src={song.preview_url}
            ref={audioRef}
          />
        </div>
      ) : (
        "no audio preview"
      )}
    </div>
  );
};
