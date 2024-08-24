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

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

import './App.css';

import { absolute, flexCenter, fullSize } from './styles';
import { useEffect, useState } from 'react';
import { MeshBasicMaterial, MeshStandardMaterial } from 'three';
import * as THREE from 'three';

const useIteration = (fps: number = 60) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setI((i) => i + 1);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [fps]);

  return i;
};

interface ModelProps {
  url: string;
  primitiveProps?: Omit<PrimitiveProps, 'object'>;
}

const BasicMaterial = new MeshBasicMaterial({ color: new THREE.Color('#520B3E') });

const Model = (props: ModelProps) => {
  const { url, primitiveProps } = props;
  const gltf = useLoader(GLTFLoader, url);

  console.log(gltf.materials);
  Object.values(gltf.materials).forEach((material) => {
    material.color = new THREE.Color('#520B3E');
  });

  return (
    <>
      <primitive object={gltf.scene.clone()} scale={0.1} {...primitiveProps} />;
      <meshStandardMaterial color={'blue'} />
    </>
  );
};

interface SubModelProps extends Omit<PrimitiveProps, 'object'> {}

const IvyCore = (props: SubModelProps) => {
  return <Model url={ivyCoreGltf} primitiveProps={props} />;
};

const IvyCenterLeft = (props: SubModelProps) => {
  return <Model url={ivyCenterLeftGltf} primitiveProps={props} />;
};

const IvyCenterRight = (props: SubModelProps) => {
  return <Model url={ivyCenterRightGltf} primitiveProps={props} />;
};

const IvyCornerStubLeft = (props: SubModelProps) => {
  return <Model url={ivyCornerStubLeftGltf} primitiveProps={props} />;
};

const IvyCornerStubRight = (props: SubModelProps) => {
  return <Model url={ivyCornerStubRightGltf} primitiveProps={props} />;
};

const IvyCornerLeft = (props: SubModelProps) => {
  return <Model url={ivyCornerLeftGltf} primitiveProps={props} />;
};

const IvyCornerRight = (props: SubModelProps) => {
  return <Model url={ivyCornerRightGltf} primitiveProps={props} />;
};

const IvyInnerLeft = (props: SubModelProps) => {
  return <Model url={ivyInnerLeftGltf} primitiveProps={props} />;
};

const IvyInnerRight = (props: SubModelProps) => {
  return <Model url={ivyInnerRightGltf} primitiveProps={props} />;
};

const IvyCenter = (props: MeshProps) => {
  return (
    <mesh {...props}>
      <mesh rotation={[0, Math.PI, Math.PI / 4]}>
        <IvyCenterLeft
          rotation={[0, 0, 0]}
          position={[0, 0, 1.15]}
          material={new MeshBasicMaterial({ color: 'red' })}
        />
        <IvyCenterRight rotation={[Math.PI, 0, -Math.PI / 2]} position={[0, 0, -1.15]} />
      </mesh>
    </mesh>
  );
};

const IvyCorner = (props: SubModelProps) => {
  return (
    <mesh {...props}>
      <mesh rotation={[0, (Math.PI * 3) / 4, Math.PI / 4]}>
        <mesh position={[0.71, 2.48, 0]}>
          <IvyCornerLeft rotation={[0, 0, 0]} position={[0, 0, 2.417]} />
          <IvyCornerRight
            rotation={[Math.PI, 0, Math.PI / 2]}
            position={[0, 0, -2.417]}
          />
        </mesh>
      </mesh>
    </mesh>
  );
};

const IvyMainCore = (props: MeshProps) => {
  return (
    <mesh {...props}>
      <IvyCore position={[0, 0, 3]} />
      <IvyCore position={[0, 0, -3]} rotation={[0, Math.PI, 0]} />
    </mesh>
  );
};

interface IvyCornersProps extends MeshProps {
  offset?: number;
}

const IvyCorners = (props: IvyCornersProps) => {
  const { offset = 5, ...rest } = props;

  return (
    <mesh {...rest}>
      <IvyCorner position={[-offset, -offset, -offset]} />
      <IvyCorner position={[offset, offset, -offset]} rotation={[0, 0, Math.PI]} />
      <IvyCorner position={[offset, -offset, offset]} rotation={[0, Math.PI, 0]} />
      <IvyCorner position={[-offset, offset, offset]} rotation={[Math.PI, 0, 0]} />
    </mesh>
  );
};

interface IvyCentersProps extends MeshProps {
  offset?: number;
}

const IvyCenters = (props: IvyCentersProps) => {
  const { offset = 5, ...rest } = props;

  return (
    <mesh {...rest}>
      <IvyCenter
        position={[-offset, 0, 0]}
        rotation={[-Math.PI / 4, 0, 0]}
        material={new MeshStandardMaterial({ color: 'red' })}
      />
      <IvyCenter position={[offset, 0, 0]} rotation={[Math.PI / 4, 0, Math.PI]} />
      <IvyCenter
        position={[0, 0, offset]}
        rotation={[Math.PI / 2, Math.PI / 4, -Math.PI / 2]}
      />
      <IvyCenter
        position={[0, 0, -offset]}
        rotation={[-Math.PI / 2, Math.PI / 4, -Math.PI / 2]}
      />
      <IvyCenter position={[0, offset, 0]} rotation={[0, -Math.PI / 4, -Math.PI / 2]} />
      <IvyCenter position={[0, -offset, 0]} rotation={[0, Math.PI / 4, Math.PI / 2]} />
    </mesh>
  );
};

const IvyCube = (props: MeshProps) => {
  const offset = 4;

  return (
    <mesh {...props}>
      {/* <IvyMainCore /> */}
      <IvyCorners offset={offset} />
      <IvyCenters offset={offset} />
    </mesh>
  );
};

function App() {
  return (
    <div css={[absolute(), fullSize, flexCenter]}>
      <Canvas>
        <ambientLight />
        <directionalLight position={[0, 0, 5]} color="white" />
        <directionalLight position={[0, 0, -5]} color="white" />
        <directionalLight position={[0, 5, 0]} color="white" />
        <directionalLight position={[0, -5, 0]} color="white" />
        <IvyCube />
        <OrbitControls />
        <axesHelper args={[5]} />

        <mesh>
          {/* basic cube */}
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="red" opacity={0.1} />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;
