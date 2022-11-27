import { scaleLinear } from "d3-scale";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BillboardWithText } from "./BillboardWithText";

import { songs } from "../static/songs";
import { a, config, useSpring } from "@react-spring/three";
import { rgb, hsl } from "d3-color";
import { Tooltip } from "@mui/material";

type SpheresProps = {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
  onClick: (arg0?: unknown) => void;
  showAxes: { showX: boolean; showY: boolean; showZ: boolean };
  selectedSong?: typeof songs[string];
};

export const SongSpheres = (props: SpheresProps) => {
  const { xRange, yRange, zRange, selectedSong, onClick, showAxes } = props;
  const { showX, showY, showZ } = showAxes;
  const [loaded, setLoaded] = useState(false);
  const { scale } = useSpring({
    scale: loaded ? 0 : 1,
    config: { ...config.gentle, precision: 0.0001 },
  });

  const ref = useRef<
    THREE.InstancedMesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
  >(null!);
  const xDomain = [0, 1];
  const yDomain = [0, 1];
  const zDomain = [0, 1];
  let xScale = scaleLinear(xDomain, showX ? xRange : [0, 0]);
  let yScale = scaleLinear(yDomain, showY ? yRange : [0, 0]);
  let zScale = scaleLinear(zDomain, showZ ? zRange : [0, 0]);

  const songArray = Object.entries(songs).map((d) => d[1]).filter(song=> {return typeof song.preview_url === 'string'})
  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();

  const getColor = (values: {
    valence: number;
    danceability: number;
    energy: number;
    popularity: number;
  }) => {
    const { valence, danceability, energy, popularity } = values;
    return hsl(danceability * valence * energy * 360, valence, 0.5).toString();
    // return rgb(255*valence,255*danceability,255*energy,1).toString()
  };

  const colorArray = Float32Array.from(
    songArray.flatMap((song) => tempColor.set(getColor(song)).toArray())
  );

  useEffect(() => {
    scale.start({
      from: 0,
      to: 1,
      reset: true,
      onChange: (props, t) => {
        updateInstancedMesh({ ref, scale: t.get(), loaded });
      },
    });
  }, [loaded, showX, showY, showZ]);
  useEffect(() => {
    setLoaded(true);
  });

  const updateInstancedMesh = (args: {
    ref: React.RefObject<any>;
    scale: number;
    loaded: boolean;
  }) => {
    const { ref, scale, loaded } = args;
    for (let i = 0; i < songArray.length; i++) {
      const song = songArray[i];
      const songData = {
        x: xScale(song.danceability) * scale,
        y: yScale(song.valence) * scale,
        z: zScale(song.energy) * scale,
      };
      tempObject.position.set(songData.x, songData.y, songData.z);
      tempObject.updateMatrix();

      if (ref.current) {
        ref.current.setMatrixAt(i, tempObject.matrix);
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  };

  return (
    <>
        <a.instancedMesh
          ref={ref}
          args={[undefined, undefined, songArray.length]}
          onClick={(e) => {
            if (e.instanceId) {
              const index = e.instanceId;
              onClick(songArray[index]);
            } else onClick(undefined);
          }}
        >
          <sphereGeometry args={[0.1, 32, 32]}>
            <instancedBufferAttribute
              attach="attributes-color"
              args={[colorArray, 3]}
            />
          </sphereGeometry>
          <meshBasicMaterial vertexColors />
        </a.instancedMesh>
      {typeof selectedSong !== "undefined" && (
        <mesh
          position={[
            xScale(selectedSong.danceability),
            yScale(selectedSong.valence),
            zScale(selectedSong.energy),
          ]}
        >
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshBasicMaterial color={"white"} />
        </mesh>
      )}
      <BillboardWithText
        position={[
          xScale(selectedSong?.danceability ?? 0),
          yScale(selectedSong?.valence ?? 0) + 0.15,
          zScale(selectedSong?.energy ?? 0),
        ]}
        text={`${selectedSong?.name} - ${selectedSong?.artists[0].name}`}
        size={0.2}
        onClick={() => {
          onClick(undefined);
        }}
      />
      <BillboardWithText
        position={[
          xScale(selectedSong?.danceability ?? 0),
          yScale(selectedSong?.valence ?? 0) - 0.15,
          zScale(selectedSong?.energy ?? 0),
        ]}
        text={`Happiness: ${selectedSong?.valence}`}
        size={0.15}
        onClick={() => {
          onClick(undefined);
        }}
      />
      <BillboardWithText
        position={[
          xScale(selectedSong?.danceability ?? 0),
          yScale(selectedSong?.valence ?? 0) - 0.3,
          zScale(selectedSong?.energy ?? 0),
        ]}
        text={`Danceability: ${selectedSong?.danceability ?? 0}`}
        size={0.15}
        onClick={() => {
          onClick(undefined);
        }}
      />
      <BillboardWithText
        position={[
          xScale(selectedSong?.danceability ?? 0),
          yScale(selectedSong?.valence ?? 0) - 0.45,
          zScale(selectedSong?.energy ?? 0),
        ]}
        text={`Energy: ${selectedSong?.energy}`}
        size={0.15}
        onClick={() => {
          onClick(undefined);
        }}
      />
    </>
  );
};
