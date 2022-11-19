import {scaleLinear} from 'd3-scale'
import React, {useEffect, useRef, useState} from 'react'
import * as THREE from 'three'
import { BillboardWithText } from './BillboardWithText'

import { songs } from '../static/songs'
import { a, config, useSpring } from '@react-spring/three'
import { rgb } from 'd3-color'

type SpheresProps = {
  xRange:[number,number],
  yRange:[number,number],
  zRange:[number,number],
  onClick:(arg0?:unknown)=>void,
  selectedSong?: typeof songs[string]
}


export const SongSpheres = (props:SpheresProps)=> {
  const {xRange, yRange, zRange, selectedSong, onClick } = props
  const [loaded,setLoaded] = useState(false)
  const {scale} = useSpring({scale:loaded? 0 : 1, config:{...config.gentle,  precision: 0.0001}})

  const ref = useRef<THREE.Mesh>(null!)
  const xDomain = [0,1]
  const yDomain = [0,1]
  const zDomain = [0,1]
  const xScale = scaleLinear(xDomain,xRange)
  const yScale = scaleLinear(yDomain,yRange)
  const zScale = scaleLinear(zDomain,zRange)

  const songArray = Object.entries(songs).map(d=> d[1])
  const tempObject = new THREE.Object3D()
  const tempColor = new THREE.Color()


  const getColor = (values:{valence:number,danceability:number,energy:number})=>{
    const {valence,danceability,energy} = values;
    // return hsl((danceability*valence * energy)*360, energy, .75).toString()
    return rgb(255*valence,255*danceability,255*energy,1).toString()
  }

  const colorArray = Float32Array.from(songArray.flatMap(
    (song) => tempColor.set(getColor(song)).toArray()))



  useEffect(()=>{
    scale.start({
      from: 0,
      to: 1,
      reset: false,
      onChange:(props, t)=> {
        updateInstancedMesh({ref,scale:t.get(),loaded})
      }
    })
  },[loaded])
  useEffect(()=>{setLoaded(true)})

  const updateInstancedMesh = (args:{ref:React.RefObject<any>, scale:number,loaded:boolean})=>{
    const {ref, scale, loaded} = args
    for (let i = 0; i < songArray.length; i++){
      const song = songArray[i]
      const songData = {
        x:xScale(song.danceability) * scale,
        y:yScale(song.valence) * scale,
        z:zScale(song.energy) * scale,
      }
      tempColor.set(getColor(song))
      tempObject.castShadow
      tempObject.position.set(songData.x,songData.y,songData.z)
      tempObject.updateMatrix()
      
      if (ref.current){
        ref.current.setMatrixAt(i, tempObject.matrix)
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  }

  return (
    <>
    <a.instancedMesh
      ref={ref}
      args={[undefined, undefined, songArray.length]}
      onClick={(e)=>{
        if (e.instanceId){
          const index = e.instanceId
          onClick(songArray[index])
        }
        else onClick(undefined)
      }
  }>
      <sphereGeometry args={[.1,32,32]}>
        <instancedBufferAttribute attach='attributes-color'args={[colorArray,3]}/>
        </sphereGeometry>
      <meshBasicMaterial toneMapped={false} vertexColors/>
    </ a.instancedMesh>
    <BillboardWithText 
    position={[
      xScale(selectedSong?.danceability ?? 0),
      yScale(selectedSong?.valence?? 0)+.15,
      zScale(selectedSong?.energy?? 0)
    ]}
    text={`${selectedSong?.name} - ${selectedSong?.artists[0].name}`}
    size={.2}
    onClick={()=>{onClick(undefined)}}
    />
    <BillboardWithText 
    position={[
      xScale(selectedSong?.danceability ?? 0),
      yScale(selectedSong?.valence?? 0)-.15,
      zScale(selectedSong?.energy?? 0)
    ]}
    text={`Happiness: ${selectedSong?.valence}`}
    size={.15}
    onClick={()=>{onClick(undefined)}}
    />
    <BillboardWithText 
    position={[
      xScale(selectedSong?.danceability ?? 0),
      yScale(selectedSong?.valence?? 0)-.3,
      zScale(selectedSong?.energy?? 0)
    ]}
    text={`Danceability: ${selectedSong?.danceability ?? 0}`}
    size={.15}
    onClick={()=>{onClick(undefined)}}
    />
    <BillboardWithText 
    position={[
      xScale(selectedSong?.danceability ?? 0),
      yScale(selectedSong?.valence?? 0)-.45,
      zScale(selectedSong?.energy?? 0)
    ]}
    text={`Energy: ${selectedSong?.energy}`}
    size={.15}
    onClick={()=>{onClick(undefined)}}
    />

    </>
)
}