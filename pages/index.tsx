import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Head from "next/head";
import React, { useEffect, useState } from "react";

import styles from "../styles/Home.module.css";
import { SongSpheres } from "../src";
import { BillboardWithText } from "../src/components/BillboardWithText";
import { SongJSON, songs } from "../src/static/songs";
import { Dialog, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { SongDetail } from "../src/components";
import { isString, uniq } from "lodash";

export default function Home() {
  const [dimensions, setDimensions] = useState({ height: 800, width: 1440 });
  const [showX, setShowX] = useState(true);
  const [showY, setShowY] = useState(true);
  const [showZ, setShowZ] = useState(true);
  const [showDividers, setShowDividers] = useState(false);
  const [showGridHelpers, setShowGridHelpers] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setDimensions({ height: window.innerHeight, width: window.innerWidth });
    }
  }, []);

  // for when the
  const DisableRender = () => useFrame(() => null, 1000);

  const availableSongs = Object.entries(songs)
    .map((d) => d[1])
    .filter((song) => isString(song.preview_url));

  const availableArists = uniq(availableSongs.map(song=>song.artists[0].name)).sort()

  const [selectedSong, setSelectedSong] = useState<SongJSON[string]>();
  const [filteredArtist, setFilteredArtist] = useState(availableArists[42]);
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
              style={{ height: "900px" }}
              onClose={() => {
                setShowDialog(false);
              }}
              children={<SongDetail song={selectedSong} />}
            />
          )}
          <Canvas camera={{ position: [-4, 6, 12] }} shadows>
            {showDialog && <DisableRender />}
            {showY && showZ && (
              <>
                {showGridHelpers && (
                  <gridHelper
                    args={[10, 10, 0xffffff]}
                    rotation={[0, 0, -Math.PI / 2]}
                  />
                )}
                {showDividers && (
                  <mesh receiveShadow castShadow>
                    <boxGeometry args={[0.01, 9, 9]} />
                    <meshPhongMaterial color={"grey"} />
                  </mesh>
                )}
              </>
            )}
            {showX && showY && (
              <>
                {showGridHelpers && (
                  <gridHelper
                    args={[10, 10, 0xffffff]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  />
                )}
                {showDividers && (
                  <mesh receiveShadow castShadow>
                    <boxGeometry args={[9, 9, 0.01]} />
                    <meshPhongMaterial color={"grey"} />
                  </mesh>
                )}
              </>
            )}
            {showZ && showX && (
              <>
                {showGridHelpers && <gridHelper args={[10, 10, 0xffffff]} />}
                {showDividers && (
                  <mesh receiveShadow castShadow>
                    <boxGeometry args={[9, 0.01, 9]} />
                    <meshPhongMaterial color={"grey"} />
                  </mesh>
                )}
              </>
            )}
            {showX && (
              <>
                <BillboardWithText position={[-5, 0, 0]} text="Stand Still" />
                <BillboardWithText position={[5, 0, 0]} text="Danceable" />
              </>
            )}
            {showY && (
              <>
                <BillboardWithText position={[0, 5, 0]} text="Happy" />
                <BillboardWithText position={[0, -5, 0]} text="Sad" />
              </>
            )}
            {showZ && (
              <>
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
              filteredArtist={filteredArtist}
            />
            <ambientLight intensity={0.5} />
            <directionalLight intensity={0.8} position={[6, 7, 3]} castShadow />
            <mesh
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -6, 0]}
            >
              <planeGeometry args={[30, 30]} />
              <shadowMaterial transparent opacity={0.15} />
            </mesh>
            <OrbitControls
              enableZoom
              maxDistance={12}
              maxPolarAngle={Math.PI}
              enableDamping
            />
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
                style={{ color: "#777" }}
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
                style={{ color: "#777" }}
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
                style={{ color: "#777" }}
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
              <FormControlLabel
                label="Show Dividers"
                style={{ color: "#777" }}
                control={
                  <Switch
                    color="default"
                    value={showDividers}
                    onChange={() => {
                      setShowDividers(!showDividers);
                    }}
                  />
                }
              />
              <FormControlLabel
                label="Show Grids"
                style={{ color: "#777" }}
                control={
                  <Switch
                    color="default"
                    value={showGridHelpers}
                    onChange={() => {
                      setShowGridHelpers(!showGridHelpers);
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
