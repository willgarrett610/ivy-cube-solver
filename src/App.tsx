/* eslint-disable react/no-unknown-property */
import { Canvas, MeshProps, PrimitiveProps, useLoader } from '@react-three/fiber';

import ivyCenterGltf from '../assets/gltf/center.gltf?url';
import ivyCornerGltf from '../assets/gltf/corner.gltf?url';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

import './App.css';

import { absolute, flexCenter, fullSize } from './styles';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cubeColors } from './utils';
import { useIteration } from './utils/react/hooks';
import { Rotate } from './components/three/Rotate';
import { Vector3 } from './utils/math/Vector3';

interface ModelProps {
  url: string;
  primitiveProps?: Omit<PrimitiveProps, 'object'>;
}

const Model = (props: ModelProps) => {
  const { url, primitiveProps } = props;
  const gltf = useLoader(GLTFLoader, url);

  const scene = gltf.scene.clone();

  return (
    <>
      <primitive object={scene} scale={0.1} {...primitiveProps} />;
      <meshStandardMaterial color={'blue'} />
    </>
  );
};

type SubModelProps = Omit<PrimitiveProps, 'object'>;

const IvyCenterModel = (props: SubModelProps) => {
  return <Model url={ivyCenterGltf} primitiveProps={props} />;
};

const IvyCornerModel = (props: SubModelProps) => {
  return <Model url={ivyCornerGltf} primitiveProps={props} />;
};

interface IvyCenterProps {
  meshProps: MeshProps;
  colors: { background: THREE.ColorRepresentation; face: THREE.ColorRepresentation };
}

const IvyCenter = (props: IvyCenterProps) => {
  const { colors, meshProps } = props;

  const meshRef = useRef<THREE.Mesh>(null);

  const materialMapping: Record<
    keyof IvyCenterProps['colors'],
    (mesh: THREE.Mesh) => THREE.Mesh
  > = {
    background: (mesh: THREE.Mesh) =>
      mesh.children[0].children[0].children[0].children[0] as THREE.Mesh,
    face: (mesh: THREE.Mesh) =>
      mesh.children[0].children[0].children[0].children[1] as THREE.Mesh,
  };

  useEffect(() => {
    const mesh = meshRef.current;

    if (mesh) {
      Object.entries(colors).forEach(([key, color]) => {
        materialMapping[key as keyof IvyCenterProps['colors']](mesh).material =
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.5,
          });
      });
    }
  }, [colors]);

  return (
    <mesh ref={meshRef} {...meshProps}>
      <IvyCenterModel />
    </mesh>
  );
};

interface IvyCornerProps {
  meshProps: MeshProps;
  colors: {
    background: THREE.ColorRepresentation;
    x: THREE.ColorRepresentation;
    y: THREE.ColorRepresentation;
    z: THREE.ColorRepresentation;
  };
}

const IvyCorner = (props: IvyCornerProps) => {
  const { colors, meshProps } = props;

  const meshRef = useRef<THREE.Mesh>(null);

  const materialMapping: Record<
    keyof IvyCornerProps['colors'],
    (mesh: THREE.Mesh) => THREE.Mesh
  > = {
    background: (mesh: THREE.Mesh) =>
      mesh.children[0].children[0].children[0] as THREE.Mesh,
    x: (mesh: THREE.Mesh) => mesh.children[0].children[0].children[1] as THREE.Mesh,
    y: (mesh: THREE.Mesh) => mesh.children[0].children[0].children[2] as THREE.Mesh,
    z: (mesh: THREE.Mesh) => mesh.children[0].children[0].children[3] as THREE.Mesh,
  };

  useEffect(() => {
    const mesh = meshRef.current;

    if (mesh) {
      Object.entries(colors).forEach(([key, color]) => {
        materialMapping[key as keyof IvyCornerProps['colors']](mesh).material =
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.5,
          });
      });
    }
  }, [colors]);

  return (
    <mesh ref={meshRef} {...meshProps}>
      <IvyCornerModel />
    </mesh>
  );
};

interface IvyCornersProps extends MeshProps {
  offset?: number;
}

const IvyCorners = (props: IvyCornersProps) => {
  const i = useIteration(60);

  const { offset = 5, ...rest } = props;

  return (
    <mesh {...rest}>
      <Rotate angle={i / 50} axis={new Vector3(-1, -1, -1).normalized.asTuple}>
        <IvyCorner
          meshProps={{
            position: [-offset, -offset, -offset],
            rotation: [0, -Math.PI / 2, 0],
          }}
          colors={{
            background: cubeColors.internals,
            x: cubeColors.orange,
            y: cubeColors.blue,
            z: cubeColors.yellow,
          }}
        />
      </Rotate>
      <IvyCorner
        meshProps={{
          position: [offset, offset, -offset],
          rotation: [0, Math.PI / 2, Math.PI],
        }}
        colors={{
          background: cubeColors.internals,
          x: cubeColors.red,
          y: cubeColors.blue,
          z: cubeColors.white,
        }}
      />
      <IvyCorner
        meshProps={{
          position: [offset, -offset, offset],
          rotation: [-Math.PI / 2, Math.PI, 0],
        }}
        colors={{
          background: cubeColors.internals,
          x: cubeColors.yellow,
          y: cubeColors.red,
          z: cubeColors.green,
        }}
      />
      <IvyCorner
        meshProps={{
          position: [-offset, offset, offset],
          rotation: [Math.PI, -Math.PI / 2, 0],
        }}
        colors={{
          background: cubeColors.internals,
          x: cubeColors.orange,
          y: cubeColors.green,
          z: cubeColors.white,
        }}
      />
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
        meshProps={{
          position: [-offset, 0, 0],
          rotation: [0, 0, Math.PI],
        }}
        colors={{ background: cubeColors.internals, face: cubeColors.orange }}
      />
      <IvyCenter
        meshProps={{ position: [offset, 0, 0] }}
        colors={{ background: cubeColors.internals, face: cubeColors.red }}
      />
      <IvyCenter
        meshProps={{
          position: [0, 0, offset],
          rotation: [Math.PI / 2, 0, Math.PI / 2],
        }}
        colors={{ background: cubeColors.internals, face: cubeColors.green }}
      />
      <IvyCenter
        meshProps={{
          position: [0, 0, -offset],
          rotation: [-Math.PI / 2, 0, Math.PI / 2],
        }}
        colors={{ background: cubeColors.internals, face: cubeColors.blue }}
      />
      <IvyCenter
        meshProps={{
          position: [0, offset, 0],
          rotation: [Math.PI / 2, Math.PI / 2, 0],
        }}
        colors={{ background: cubeColors.internals, face: cubeColors.white }}
      />
      <IvyCenter
        meshProps={{
          position: [0, -offset, 0],
          rotation: [-Math.PI / 2, Math.PI / 2, 0],
        }}
        colors={{ background: cubeColors.internals, face: cubeColors.yellow }}
      />
    </mesh>
  );
};

const IvyCube = (props: MeshProps) => {
  const offset = 3.85;

  return (
    <mesh {...props}>
      {/* <IvyMainCore /> */}
      <IvyCorners offset={offset} />
      <IvyCenters offset={offset} />
      <mesh>
        <sphereGeometry args={[offset, 32, 32]} />
        <meshStandardMaterial color={cubeColors.internals} roughness={0.5} />
      </mesh>
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
      </Canvas>
    </div>
  );
}

export default App;
