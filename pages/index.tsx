import { Dialog } from "@mui/material";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { isString, uniq } from "lodash";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Vector3 } from "three";

import styles from "../styles/Home.module.css";
import { SongSpheres } from "../src";
import { BillboardWithText } from "../src/components/BillboardWithText";
import { SongJSON, songs } from "../src/static/songs";
import { SongDetail } from "../src/components";
import { SideBar } from "../src/components/SideBar";
import { TopBar } from "../src/components/TopBar";

export default function Home() {
  const [dimensions, setDimensions] = useState({ height: 800, width: 1440 });
  const [showX, setShowX] = useState(true);
  const [showY, setShowY] = useState(true);
  const [showZ, setShowZ] = useState(true);
  const [showDividers, setShowDividers] = useState(false);
  const [showGridHelpers, setShowGridHelpers] = useState(true);

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

  const availableArtists = uniq(
    availableSongs.map((song) => {
      const artistName = song.artists[0].name
      const songCount = availableSongs.filter(song=>song.artists[0].name === artistName).length
     return  `${artistName} (${songCount} song${songCount !== 1 ? 's' : ''})`
    })
  ).sort();

  const [selectedSong, setSelectedSong] = useState<SongJSON[string]>();
  const [hoveredSong, setHoveredSong] = useState<SongJSON[string]>();
  const [songHistory, setSongHistory] = useState<Array<SongJSON[string]>>([]);
  const [filteredArtist, setFilteredArtist] = useState<string>();
  const [showDialog, setShowDialog] = useState(false);

  const [showSidebar, setShowSideBar] = useState(false);

  const handleSideBarClose = () => {
    setShowSideBar(false);
  };

  const toggleSideBar = () => {
    setShowSideBar((prior) => !prior);
  };

  const handleClick = (selectedSong?: SongJSON[string]) => {
    setSelectedSong(() => selectedSong);
    if (selectedSong) {
      setShowDialog(() => true);
      setSongHistory((prior) => uniq([selectedSong, ...prior]));
    }
  };
  const handleMouseOver = (song?: SongJSON[string]) => {
    setHoveredSong(() => song);
  };

  const handleArtistSearchChange = (value?: string | null) => {
    if (value) {
      const trimmedValue = value.split('(')[0].trimEnd()
      setFilteredArtist(trimmedValue);
    }
    else {
      setFilteredArtist(undefined);
    }
  };

  const [lookAtTarget, setLookAtTarget] = useState(new Vector3(0, 0, 0));

  return (
    <div className={styles.container}>
      <Head>
        <title>audioForma</title>
        <meta name="description" content="What does your music look like?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <TopBar
          availableArtists={availableArtists}
          handleChange={handleArtistSearchChange}
        />
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
              onClick={handleClick}
              onMouseOver={handleMouseOver}
              hoveredSong={hoveredSong}
              selectedSong={selectedSong}
              showAxes={{ showX, showY, showZ }}
              filteredArtist={filteredArtist}
              setLookAtTarget={setLookAtTarget}
            />
            <ambientLight intensity={0.7} />
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
              target={lookAtTarget}
            />
          </Canvas>

          <SideBar
            availableArtists={availableArtists}
            filteredArtist={filteredArtist}
            setFilteredArtist={setFilteredArtist}
            showX={showX}
            showY={showY}
            showZ={showZ}
            setShowX={setShowX}
            setShowY={setShowY}
            setShowZ={setShowZ}
            showDividers={showDividers}
            setShowDividers={setShowDividers}
            showGridHelpers={showGridHelpers}
            setShowGridHelpers={setShowGridHelpers}
            open={showSidebar}
            onClose={handleSideBarClose}
            onClickTab={toggleSideBar}
            songHistory={songHistory}
            onClickListItem={handleClick}
          />
        </div>
      </main>
    </div>
  );
}
