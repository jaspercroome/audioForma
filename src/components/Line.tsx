import React, {useRef, useLayoutEffect} from 'react'
import * as THREE from 'three';


type LineProps = {
  start:[number,number,number],
  end:[number,number,number]
  color?:React.CSSProperties['color']
}

export const Line = (props:LineProps) => {
  const {start,end, color='black'} = props;
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current?.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
  }, [start, end])
  return (
    <line ref={ref} stroke='4'>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </line>
  )
}