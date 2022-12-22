import { scaleLinear } from "d3-scale";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BillboardWithText } from "./BillboardWithText";

import { SongJSON, songs } from "../static/songs";
import { a, config, useSpring } from "@react-spring/three";
import { rgb, hsl } from "d3-color";
import { Vector3 } from "three";

type SpheresProps = {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
  onClick: (selectedSong?: SongJSON[string]) => void;
  onMouseOver: (selectedSong?: SongJSON[string]) => void;
  showAxes: { showX: boolean; showY: boolean; showZ: boolean };
  hoveredSong?: typeof songs[string];
  selectedSong?: typeof songs[string];
  filteredArtist?: string;
  setLookAtTarget: (arg0: Vector3) => void;
};

export const SongSpheres = (props: SpheresProps) => {
  const {
    xRange,
    yRange,
    zRange,
    hoveredSong,
    onClick,
    onMouseOver,
    showAxes,
    filteredArtist,
    setLookAtTarget,
  } = props;
  const { showX, showY, showZ } = showAxes;
  const [loaded, setLoaded] = useState(true);
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

  const songArray = useMemo(()=>Object.entries(songs)
    .map((d) => d[1])
    .filter((song) => {
      return typeof song.preview_url === "string";
    })
    .filter((song) => {
      if (filteredArtist) {
        return song.artists[0].name === filteredArtist;
      } else return true;
    }),[songs, filteredArtist]);

  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();

  const getColor = (values: {
    valence: number;
    danceability: number;
    energy: number;
    popularity: number;
  }) => {
    const { valence, danceability, energy, popularity } = values;
    return hsl(danceability * valence * energy * 360, 0.5, 0.5).toString();
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
  }, [showX, showY, showZ, songArray]);

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
        castShadow={true}
        ref={ref}
        args={[undefined, undefined, songArray.length]}
        onPointerEnter={(e) => {
          if (typeof e.instanceId !== "undefined") {
            const index = e.instanceId;
            const thisSong = songArray[index];
            onMouseOver(thisSong);
          }
        }}
        onPointerLeave={() => {
          onMouseOver(undefined);
        }}
        onClick={(e) => {
          if (typeof e.instanceId !== "undefined") {
            const index = e.instanceId;
            const thisSong = songArray[index];
            const vector = new Vector3(
              xScale(thisSong.danceability),
              yScale(thisSong.valence),
              zScale(thisSong.energy)
            );
            // setLookAtTarget(vector);
            console.log(songArray[index]);
            onClick(songArray[index]);
          } else onClick(undefined);
        }}
      >
        <sphereGeometry args={[0.15, 32, 32]}>
          <instancedBufferAttribute
            attach="attributes-color"
            args={[colorArray, 3]}
          />
        </sphereGeometry>
        <meshBasicMaterial vertexColors />
      </a.instancedMesh>
      {hoveredSong && (
        <>
          <BillboardWithText
            position={[
              xScale(hoveredSong?.danceability ?? 0),
              yScale(hoveredSong?.valence ?? 0) + 0.25,
              zScale(hoveredSong?.energy ?? 0),
            ]}
            text={`${hoveredSong?.name} - ${hoveredSong?.artists[0].name}`}
            size={0.2}
            onClick={() => {
              onClick(undefined);
            }}
          />
          <BillboardWithText
            position={[
              xScale(hoveredSong?.danceability ?? 0),
              yScale(hoveredSong?.valence ?? 0) - 0.25,
              zScale(hoveredSong?.energy ?? 0),
            ]}
            text={`Happiness: ${hoveredSong?.valence}`}
            size={0.15}
            onClick={() => {
              onClick(undefined);
            }}
          />
          <BillboardWithText
            position={[
              xScale(hoveredSong?.danceability ?? 0),
              yScale(hoveredSong?.valence ?? 0) - 0.5,
              zScale(hoveredSong?.energy ?? 0),
            ]}
            text={`Danceability: ${hoveredSong?.danceability ?? 0}`}
            size={0.15}
            onClick={() => {
              onClick(undefined);
            }}
          />
          <BillboardWithText
            position={[
              xScale(hoveredSong?.danceability ?? 0),
              yScale(hoveredSong?.valence ?? 0) - 0.75,
              zScale(hoveredSong?.energy ?? 0),
            ]}
            text={`Energy: ${hoveredSong?.energy}`}
            size={0.15}
            onClick={() => {
              onClick(undefined);
            }}
          />
        </>
      )}
    </>
  );
};
