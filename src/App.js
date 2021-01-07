import ReactDOM from 'react-dom'
import * as THREE from 'three/src/Three'
import React, { useState, useRef, useMemo } from 'react'
// A THREE.js React renderer, see: https://github.com/drcmda/react-three-fiber
import { Canvas, useFrame } from 'react-three-fiber'
// A React animation lib, see: https://github.com/react-spring/react-spring
import {useCycle} from "framer-motion"
import { useSpring, animated } from 'react-spring/three'
import './App.scss'
import { OrbitControls } from "drei"
function Octahedron() {
  const [active, cycleActive] = useCycle(false, true)
  const [hovered, cycleHover] = useCycle(false, true)
  const vertices = [[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]]
  const { color, pos, pos2, pos3, pos4, pos5, pos6, opacity, ...props } = useSpring({
    color: active ? 'hotpink' : 'white',
    pos: active ? [0, 0, 2] : [0, 0, 0],
    pos2: active ? [0, 2, 0] : [0, 0, 0],
    pos3: active ? [2, 0, 0] : [0, 0, 0],
    pos4: active ? [0, 0, -2] : [0, 0, 0],
    pos5: active ? [0, -2, 0] : [0, 0, 0],
    pos6: active ? [-2, 0, 0] : [0, 0, 0],
    opacity: active ? 1:0,
    'material-opacity': hovered ? 0.6 : 0.25,
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    rotation: active ? [THREE.Math.degToRad(180), 0, THREE.Math.degToRad(45)] : [0, 0, 0],
    config: { mass: 1, tension: 1000, friction: 30, precision: 0.001 }
  })
  return (
    <group>
      <animated.line position={pos}>
        <geometry attach="geometry" vertices={vertices.map(v => new THREE.Vector3(...v))} />
        <animated.lineBasicMaterial attach="material" color={color} />
      </animated.line>
      <animated.line position={pos2} rotation={[Math.PI/2,0,0]}>
        <geometry attach="geometry" vertices={vertices.map(v => new THREE.Vector3(...v))} />
        <animated.lineBasicMaterial attach="material" color={color} />
      </animated.line>
      <animated.line position={pos3} rotation={[0,Math.PI/2,0]}>
        <geometry attach="geometry" vertices={vertices.map(v => new THREE.Vector3(...v))} />
        <animated.lineBasicMaterial attach="material" color={color} />
      </animated.line>
      <animated.line position={pos4}>
        <geometry attach="geometry" vertices={vertices.map(v => new THREE.Vector3(...v))} />
        <animated.lineBasicMaterial attach="material" color={color} />
      </animated.line>
      <animated.line position={pos5} rotation={[Math.PI/2,0,0]}>
        <geometry attach="geometry" vertices={vertices.map(v => new THREE.Vector3(...v))} />
        <animated.lineBasicMaterial attach="material" color={color} />
      </animated.line>
      <animated.line position={pos6} rotation={[0,Math.PI/2,0]}>
        <geometry attach="geometry" vertices={vertices.map(v => new THREE.Vector3(...v))} />
        <animated.lineBasicMaterial attach="material" color={color} />
      </animated.line>
      <animated.mesh onClick={e => cycleActive()} onPointerOver={e => cycleHover(true)} onPointerOut={e => cycleHover(false)} {...props}>
        <octahedronGeometry attach="geometry" />
        <meshStandardMaterial attach="material" color="grey" transparent />
      </animated.mesh>
    </group>
  )
}

function Stars() {
  let group = useRef()
  let theta = 0
  useFrame(() => {
    // Some things maybe shouldn't be declarative, we're in the render-loop here with full access to the instance
    const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.1)))
    const s = Math.cos(THREE.Math.degToRad(theta * 2))
    group.current.rotation.set(r, r, r)
    group.current.scale.set(s, s, s)
  })
  const [geo, mat, vertices, coords] = useMemo(() => {
    const geo = new THREE.SphereBufferGeometry(1, 10, 10)
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('lightblue') })
    const coords = new Array(2000).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
    const vertices = [[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]]
    return [geo, mat, vertices, coords]
  }, [])
  return (
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </group>
  )
}

export default function App() {
  return (
    <Canvas>
      <ambientLight color="lightblue" />
      <pointLight color="white" intensity={1} position={[10, 10, 10]} />
      <Octahedron />
      <Stars />
      <OrbitControls/>
    </Canvas>
  )
}
