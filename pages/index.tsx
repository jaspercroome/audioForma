import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Effects, OrbitControls, Plane } from "@react-three/drei";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { UnrealBloomPass } from "three-stdlib";

import styles from "../styles/Home.module.css";
import { SongSpheres } from "../src";
import { BillboardWithText } from "../src/components/BillboardWithText";
import { SongJSON } from "../src/static/songs";
import { Dialog, FormControlLabel, FormGroup, Switch } from "@mui/material";
import Meyda from "meyda";
import { SongDetail } from "../src/components";

// extend objects from three to r3f
extend({ UnrealBloomPass });

export default function Home() {
  const [dimensions, setDimensions] = useState({ height: 800, width: 1440 });
  const [showX, setShowX] = useState(true);
  const [showY, setShowY] = useState(true);
  const [showZ, setShowZ] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setDimensions({ height: window.innerHeight, width: window.innerWidth });
    }
  }, []);

  // for when the
  const DisableRender = () => useFrame(() => null, 1000);

  const [selectedSong, setSelectedSong] = useState<SongJSON[string]>();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (typeof selectedSong?.name !== "undefined") {
      setShowDialog(true);
    }
  }, [selectedSong]);

  return (
    <div className={styles.container}>
      <Head>
        <title>audioForma</title>
        <meta name="description" content="What does your music look like?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div id="canvas-container" style={{ height: dimensions.height }}>
          {showDialog && selectedSong && (
            <Dialog
              open={showDialog}
              fullWidth
              onClose={() => {
                setShowDialog(false);
              }}
              children={<SongDetail song={selectedSong} />}
            />
          )}
          <Canvas camera={{ position: [-4, 6, 12] }}>
            {showDialog && <DisableRender />}
            <color attach="background" args={["black"]} />
            {showY && showZ && (
              <>
                <gridHelper
                  args={[10, 10, 0xffffff]}
                  rotation={[0, 0, -Math.PI / 2]}
                />
                <mesh>
                  <boxGeometry args={[0.01, 9, 9]} />
                  <meshPhongMaterial color={"grey"} />
                </mesh>
                <BillboardWithText position={[0, 5, 0]} text="Happy" />
                <BillboardWithText position={[0, -5, 0]} text="Sad" />
                <BillboardWithText position={[0, 0, -5]} text="Calm" />
                <BillboardWithText position={[0, 0, 5]} text="Hyped Up" />
              </>
            )}
            {showX && showY && (
              <>
                <gridHelper
                  args={[10, 10, 0xffffff]}
                  rotation={[-Math.PI / 2, 0, 0]}
                />
                <mesh>
                  <boxGeometry args={[9, 9, 0.01]} />
                  <meshPhongMaterial color={"grey"} />
                </mesh>
                <BillboardWithText position={[0, 5, 0]} text="Happy" />
                <BillboardWithText position={[0, -5, 0]} text="Sad" />
                <BillboardWithText position={[-5, 0, 0]} text="Stand Still" />
                <BillboardWithText position={[5, 0, 0]} text="Danceable" />
              </>
            )}
            {showZ && showX && (
              <>
                <gridHelper args={[10, 10, 0xffffff]} />
                <mesh>
                  <boxGeometry args={[9, .01, 9]} />
                  <meshPhongMaterial color={"grey"} />
                </mesh>
                <BillboardWithText position={[-5, 0, 0]} text="Stand Still" />
                <BillboardWithText position={[5, 0, 0]} text="Danceable" />
                <BillboardWithText position={[0, 0, -5]} text="Calm" />
                <BillboardWithText position={[0, 0, 5]} text="Hyped Up" />
              </>
            )}
            <SongSpheres
              xRange={[-5, 5]}
              yRange={[-5, 5]}
              zRange={[-5, 5]}
              onClick={setSelectedSong}
              selectedSong={selectedSong}
              showAxes={{ showX, showY, showZ }}
            />
            <ambientLight intensity={0.3} castShadow />
            <directionalLight
              intensity={0.2}
              position={[-6, 7, 6]}
              castShadow
            />
            <OrbitControls
              enableZoom
              maxDistance={12}
              maxPolarAngle={Math.PI}
              enableDamping
            />
            <Post />
          </Canvas>

          <div
            style={{
              position: "relative",
              bottom: "400px",
              left: "10px",
              height: "100px",
              width: "400px",
            }}
          >
            <FormGroup>
              <FormControlLabel
                label="Measure Danceability"
                style={{ color: "whiteSmoke" }}
                control={
                  <Switch
                    defaultChecked
                    color="default"
                    value={showX}
                    onChange={() => {
                      setShowX(!showX);
                    }}
                  />
                }
              />
              <FormControlLabel
                label="Measure Happiness"
                style={{ color: "whiteSmoke" }}
                control={
                  <Switch
                    defaultChecked
                    color="default"
                    value={showY}
                    onChange={() => {
                      setShowY(!showY);
                    }}
                  />
                }
              />
              <FormControlLabel
                label="Measure Energy"
                style={{ color: "whiteSmoke" }}
                control={
                  <Switch
                    defaultChecked
                    color="default"
                    value={showZ}
                    onChange={() => {
                      setShowZ(!showZ);
                    }}
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
      </main>
    </div>
  );
}
const Post = () => {
  return (
    <Effects disableGamma>
      <unrealBloomPass threshold={0.11} strength={0.6} radius={0.1} />
    </Effects>
  );
};
