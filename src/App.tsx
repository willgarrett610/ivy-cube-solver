/* eslint-disable react/no-unknown-property */
import { Canvas, MeshProps, PrimitiveProps, useLoader } from '@react-three/fiber';

import ivyCenterGltf from '../assets/gltf/center.gltf?url';
import ivyCornerGltf from '../assets/gltf/corner.gltf?url';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

import './App.css';

import { absolute, flexCenter, fullSize, padding } from './styles';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cubeColors } from './utils';
import { Rotate } from './components/three/Rotate';
import { Vector3 } from './utils/math/Vector3';
import { State } from './graph/types';

import { FlexColumn, FlexRow } from './components/base/Flex';
import { Button } from '@blueprintjs/core';

import '@blueprintjs/core/lib/css/blueprint.css';
import { IconNames } from '@blueprintjs/icons';
import { genGraph, getSolvePath } from './graph/gen';
import { mod } from './utils/math';

// genGraph();

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

interface IvyCornersProps {
  offset?: number;
  meshProps?: MeshProps;
  cubeState: State;
}

const IvyCorners = (props: IvyCornersProps) => {
  const { offset = 0, meshProps, cubeState } = props;

  const { corners } = cubeState;

  return (
    <mesh {...meshProps}>
      <Rotate
        angle={(-corners[0] * (2 * Math.PI)) / 3}
        axis={new Vector3(-1, -1, -1).normalized.asTuple}
      >
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
      <Rotate
        angle={(-corners[1] * (2 * Math.PI)) / 3}
        axis={new Vector3(-1, 1, 1).normalized.asTuple}
      >
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
      </Rotate>
      <Rotate
        angle={(-corners[2] * (2 * Math.PI)) / 3}
        axis={new Vector3(1, -1, 1).normalized.asTuple}
      >
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
      </Rotate>
      <Rotate
        angle={(-corners[3] * (2 * Math.PI)) / 3}
        axis={new Vector3(1, 1, -1).normalized.asTuple}
      >
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
      </Rotate>
    </mesh>
  );
};

interface IvyCentersProps {
  offset?: number;
  meshProps?: MeshProps;
  cubeState: State;
}

const centerMapping: Record<number, string> = {
  0: cubeColors.blue,
  1: cubeColors.yellow,
  2: cubeColors.green,
  3: cubeColors.white,
  4: cubeColors.orange,
  5: cubeColors.red,
};

const IvyCenters = (props: IvyCentersProps) => {
  const { offset = 0, meshProps, cubeState } = props;

  const { centers } = cubeState;

  return (
    <mesh {...meshProps}>
      <IvyCenter
        meshProps={{
          position: [0, 0, -offset],
          rotation: [-Math.PI / 2, 0, Math.PI / 2],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[0]] }}
      />
      <IvyCenter
        meshProps={{
          position: [0, -offset, 0],
          rotation: [-Math.PI / 2, Math.PI / 2, 0],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[1]] }}
      />
      <IvyCenter
        meshProps={{
          position: [0, 0, offset],
          rotation: [Math.PI / 2, 0, Math.PI / 2],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[2]] }}
      />
      <IvyCenter
        meshProps={{
          position: [0, offset, 0],
          rotation: [Math.PI / 2, Math.PI / 2, 0],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[3]] }}
      />
      <IvyCenter
        meshProps={{
          position: [-offset, 0, 0],
          rotation: [0, 0, Math.PI],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[4]] }}
      />
      <IvyCenter
        meshProps={{ position: [offset, 0, 0] }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[5]] }}
      />
    </mesh>
  );
};

interface IvyCubeProps {
  meshProps?: MeshProps;
  cubeState: State;
}

const IvyCube = (props: IvyCubeProps) => {
  const { meshProps, cubeState } = props;

  const offset = 3.85;

  return (
    <mesh {...meshProps}>
      {/* <IvyMainCore /> */}
      <IvyCorners cubeState={cubeState} offset={offset} />
      <IvyCenters cubeState={cubeState} offset={offset} />
      <mesh>
        <sphereGeometry args={[offset, 32, 32]} />
        <meshStandardMaterial color={cubeColors.internals} roughness={0.5} />
      </mesh>
    </mesh>
  );
};

const path = getSolvePath(genGraph()!);

console.log(path);

function App() {
  const [pathIndex, setPathIndex] = useState(0);

  const incrementPathIndex = () => {
    setPathIndex((prev) => mod(prev + 1, path.length));
  };

  const decrementPathIndex = () => {
    setPathIndex((prev) => mod(prev - 1, path.length));
  };

  const pathState = path[pathIndex];

  return (
    <div css={[absolute(), fullSize, flexCenter]}>
      <FlexColumn css={[absolute(0, 0), padding('xl'), { zIndex: 100 }]} gap={5}>
        {pathIndex + 1} / {path.length}
        <FlexRow gap={5}>
          <Button onClick={decrementPathIndex} icon={IconNames.ChevronLeft}>
            Prev
          </Button>
          <Button onClick={incrementPathIndex} rightIcon={IconNames.ChevronRight}>
            Next
          </Button>
        </FlexRow>
      </FlexColumn>
      <Canvas>
        <ambientLight />
        <directionalLight position={[0, 0, 5]} color="white" />
        <directionalLight position={[0, 0, -5]} color="white" />
        <directionalLight position={[0, 5, 0]} color="white" />
        <directionalLight position={[0, -5, 0]} color="white" />
        <IvyCube cubeState={pathState} />
        <OrbitControls />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
}

export default App;
