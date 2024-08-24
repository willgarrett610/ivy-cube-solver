/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Canvas, MeshProps, PrimitiveProps, useLoader } from '@react-three/fiber';
import ivyCoreGltf from '../assets/gltf/ivy_core.gltf?url';

import ivyCenterLeftGltf from '../assets/gltf/ivy_center_x6_l.gltf?url';
import ivyCenterRightGltf from '../assets/gltf/ivy_center_x6_r.gltf?url';

import ivyCornerStubLeftGltf from '../assets/gltf/ivy_corner_stub_x4_l.gltf?url';
import ivyCornerStubRightGltf from '../assets/gltf/ivy_corner_stub_x4_r.gltf?url';

import ivyCornerLeftGltf from '../assets/gltf/ivy_corner_x4_l.gltf?url';
import ivyCornerRightGltf from '../assets/gltf/ivy_corner_x4_r.gltf?url';

import ivyInnerLeftGltf from '../assets/gltf/ivy_inner_x4_l.gltf?url';
import ivyInnerRightGltf from '../assets/gltf/ivy_inner_x4_r.gltf?url';

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";



import './App.css';

import { absolute, flexCenter, fullSize } from './styles';
import { useEffect, useState } from 'react';

interface ModelProps  { url: string, primitiveProps?: Omit<PrimitiveProps, "object"> }

const Model = (props: ModelProps) => {
  const { url, primitiveProps } = props;
  const gltf = useLoader(GLTFLoader, url);

  return (
    <primitive object={gltf.scene} scale={0.1} {...primitiveProps} />
  );
}

interface SubModelProps extends Omit<PrimitiveProps, "object"> {

}

const IvyCore = (props: SubModelProps) => {
  return (
    <Model url={ivyCoreGltf} primitiveProps={props} />
  );
}

const IvyCenterLeft = (props: SubModelProps) => {
  return (
    <Model url={ivyCenterLeftGltf}  primitiveProps={props} />
  );
}

const IvyCenterRight = (props: SubModelProps) => {
  return (
    <Model url={ivyCenterRightGltf}  primitiveProps={props} />
  );
}

const IvyCornerStubLeft = (props: SubModelProps) => {
  return (
    <Model url={ivyCornerStubLeftGltf}  primitiveProps={props} />
  );
}

const IvyCornerStubRight = (props: SubModelProps) => {
  return (
    <Model url={ivyCornerStubRightGltf}  primitiveProps={props} />
  );
}

const IvyCornerLeft = (props: SubModelProps) => {
  return (
    <Model url={ivyCornerLeftGltf}  primitiveProps={props} />
  );
}

const IvyCornerRight = (props: SubModelProps) => {
  return (
    <Model url={ivyCornerRightGltf}  primitiveProps={props} />
  );
}

const IvyInnerLeft = (props: SubModelProps) => {
  return (
    <Model url={ivyInnerLeftGltf}  primitiveProps={props} />
  );
}

const IvyInnerRight = (props: SubModelProps) => {
  return (
    <Model url={ivyInnerRightGltf}  primitiveProps={props} />
  );
}

const IvyCenter = (props: MeshProps) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setI(i => i + 1);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <mesh {...props}>
      <IvyCenterLeft rotation={[0,0,0]} position={[0,0,1.15]} />
      <IvyCenterRight rotation={[0, 0, Math.PI]} scale={[.1, .1, -.1]} position={[0,0,-1.15]}/>
    </mesh>
  );
}

const IvyCorner = (props: SubModelProps) => {
  return (
    <mesh>
      <IvyCornerLeft rotation={[0,0,0]} position={[0,0,1.15]} />
      <IvyCornerRight rotation={[0, 0, Math.PI]} position={[0,0,-1.15]} />
    </mesh>
  );
}

function App() {

  return (
    <div css={[absolute(), fullSize, flexCenter]}>
      <Canvas>
        <ambientLight />
        <directionalLight position={[0, 0, 5]} color="red" />
        <directionalLight position={[0, 0, -5]} color="blue" />
        <directionalLight position={[0, 5, 0]} color="green" />
        <directionalLight position={[0, -5, 0]} color="cyan" />
        <IvyCenter position={[0,40,0]} />
        <IvyCorner />
        <OrbitControls />


        {/* <mesh rotation={[1,0,0]}>
          <boxGeometry args={[2,2,2]}/>
          <meshStandardMaterial />
        </mesh> */}
      </Canvas>
    </div>
  );
}

export default App;
