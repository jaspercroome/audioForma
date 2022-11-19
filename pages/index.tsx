import { Canvas, extend, useThree } from '@react-three/fiber';
import { Effects, OrbitControls, Plane, } from '@react-three/drei';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { SSAOPass, UnrealBloomPass } from 'three-stdlib'


import styles from '../styles/Home.module.css';
import { SongSpheres } from '../src';
import { BillboardWithText } from '../src/components/BillboardWithText';
import { SongJSON } from '../src/static/songs';

// extend objects from three to r3f
extend({ SSAOPass, UnrealBloomPass })

export default function Home() {
  const [dimensions, setDimensions] = useState({ height: 800, width: 1440 });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setDimensions({ height: window.innerHeight, width: window.innerWidth });
    }
  }, []);

  const [selectedSong, setSelectedSong] = useState<SongJSON[string]>()

  return (
    <div className={styles.container}>
      <Head>
        <title>audioForma</title>
        <meta name="description" content="What does your music look like?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div id="canvas-container" style={{ height: dimensions.height }}>
          <Canvas shadows camera={{ position: [-4, 6, 12] }}>
          <color attach="background" args={['#f0f0f0']} />
            <gridHelper
              args={[10, 10, 0x333, 0xaaaaaa]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            <gridHelper
              args={[10, 10, 0x333, 0xaaaaaa]}
              rotation={[0, 0, -Math.PI / 2]}
            />
            <gridHelper args={[10, 10, 0x333, 0xaaaaaa]} />
            <BillboardWithText position={[0, 5, 0]} text='Happy'/>
            <BillboardWithText position={[0, -5, 0]} text="Sad" />
            <BillboardWithText position={[-5, 0, 0]} text="Stand Still" />
            <BillboardWithText position={[5, 0, 0]} text="Danceable" />
            <BillboardWithText position={[0, 0, -5]} text="Calm" />
            <BillboardWithText position={[0, 0, 5]} text="Hyped Up" />
            <SongSpheres xRange={[-5, 5]} yRange={[-5, 5]} zRange={[-5, 5]} onClick={setSelectedSong} selectedSong={selectedSong}/>
            <ambientLight intensity={0.6} castShadow/>
            <directionalLight intensity={0.6} position={[-6, 7, 6]} castShadow/>
            <Plane
  receiveShadow
  rotation={[-Math.PI / 2,0,0]}
  position={[0, -10,0]}
  args={[100, 100]}
>
  <meshStandardMaterial attach="material" color="papayawhip" />
</Plane>
            <OrbitControls
              enableZoom
              maxDistance={12}
              maxPolarAngle={Math.PI}
              enableDamping
            />
            <Post />
          </Canvas>
                {selectedSong &&
    <div style={{position:'absolute', bottom:'100px',left:'10px',height:'100px',width:'200px'}}>
    <h2>{selectedSong.name}</h2>
    <h4>{selectedSong.artists[0].name}</h4>
    {selectedSong.preview_url ? (
    <audio controls src={selectedSong.preview_url}/>
    ) : 'no audio preview'}
    </div>
    }
        </div>
      </main>
    </div>
  );
}
const Post = () => {
  const { scene, camera } = useThree()
  return (
    <Effects disableGamma>
      <sSAOPass args={[scene, camera]} kernelRadius={0.5} maxDistance={0.1} />
      <unrealBloomPass threshold={0.9} strength={0.75} radius={0.5} />
    </Effects>
  )
}
