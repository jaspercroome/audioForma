import { Divider, Typography } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { scaleLinear } from "d3-scale";
import React, { useEffect, useRef, useState } from "react";
import {
  useAfMicroServicePost,
  FormattedAFData,
} from "../hooks/useAfMicroService";
import { noteLocations, octaves } from "../static/constants";
import { SongJSON } from "../static/songs";
import { BillboardWithText } from "./BillboardWithText";

export const SongDetail = (props: { song: SongJSON[string] }) => {
  const { song } = props;

  const previewId = song.preview_url?.split("/", 5)[4].split("?", 1)[0] || "";

  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const {
    data: songData,
    isLoading,
    isError,
    error: afMicroServiceError,
  } = useAfMicroServicePost(previewId);

  useEffect(() => {
    if (isLoading) {
      console.log("loading data from af microservice");
    } else if (isError) {
      console.error(afMicroServiceError);
    } else if (songData) {
      console.log("loaded!");
    }
  }, [isLoading, isError, afMicroServiceError, songData]);

  return (
    <div style={{ padding: "0px 16px 0px 16px" }}>
      <h2>
        {song.name} - {song.artists[0].name}
      </h2>
      <Divider />
      {song.preview_url ? (
        <div
          style={{
            height: "600px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column",
          }}
        >
          {!songData && (
            <div style={{display:'flex',flexDirection:'column',alignContent:'center'}}>
              <Typography variant="h1">Loading...</Typography>
              <Typography variant="caption">(this generally takes 5-10 seconds)</Typography>
            </div>
          )}
          {songData && isPlaying && (
            <>
              <Canvas>
                <SongDetailSpheres songData={songData} />
                <OrbitControls
                  maxZoom={2}
                  minZoom={0.5}
                  maxDistance={12}
                  maxPolarAngle={Math.PI}
                  enableDamping
                />
              </Canvas>
            </>
          )}
          {songData && (
            <audio
              ref={audioRef}
              src={song.preview_url || ""}
              crossOrigin="anonymous"
              autoPlay
              onPlay={() => {
                setIsPlaying(true);
              }}
            />
          )}
        </div>
      ) : (
        "no audio preview"
      )}
    </div>
  );
};

export const SongDetailSpheres = (props: {
  songData: {
    time: number;
    notes: FormattedAFData[];
  }[];
}) => {
  const { songData } = props;

  const [time, setTime] = useState(0);

  const maxMagnitude = Math.max(
    ...songData.map((d) =>
      Math.max(...d.notes.map((d) => Math.max(...d.map((d) => d.magnitude))))
    )
  );

  const getCurrentSongData = (
    songData: {
      time: number;
      notes: FormattedAFData[];
    }[],
    elapsedTime: number
  ) => {
    const checkTimes = songData.map((d) => d.time);
    const finalTime = checkTimes[checkTimes.length - 1];

    while (elapsedTime < finalTime) {
      const currentSongData =
        songData.find((d) => d.time >= elapsedTime) ?? songData[0];
      return currentSongData;
    }
    return { notes: {}, time: 0 };
  };

  //update the spheres
  useFrame((state) => {
    const { clock, camera } = state;
    const elapsedMilliseconds = clock.getElapsedTime() * 1000;
    const currentSongData = getCurrentSongData(songData, elapsedMilliseconds);
    setTime(currentSongData.time);
    camera.position.y = Math.sin(state.clock.getElapsedTime()) * 4;
    camera.position.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 5;
  }, 0);

  const rScale = scaleLinear().domain([0.01, maxMagnitude/2]).range([0.01, .5]);
  const yScale = scaleLinear().domain([0, 8]).range([-3, 3]);
  const fontSizeScale = scaleLinear()
    .domain([0.01, maxMagnitude])
    .range([0.01, 1]);

    rScale.clamp(true)

  return songData ? (
    <>
      {songData
        .find((d) => {
          return d.time >= time;
        })
        ?.notes.map((octave, index) => {
          return octave.map((note, noteIndex) => {
            const { magnitude, note_name } = note;
            const noteOctave = index;
            const {
              x,
              y: z,
              angle,
            } = noteLocations.find((n) => {
              return n.note === note.note_name;
            }) || { x: 0, y: 0, angle: 0 };

            return (
              <React.Fragment key={`octave${index}-${note_name}-${noteIndex}`}>
                <mesh position={[x * 2, yScale(noteOctave), z * 2]}>
                  <sphereGeometry args={[rScale(magnitude), 32, 16]} />
                  <meshLambertMaterial emissive={`hsl(${angle}, 70%, 60%)`} />
                </mesh>
                <BillboardWithText
                  text={magnitude > 0.6 ? note_name : ""}
                  position={[x * 3, yScale(noteOctave), z * 3]}
                  size={fontSizeScale(magnitude)}
                />
              </React.Fragment>
            );
          });
        })}
    </>
  ) : null;
};
