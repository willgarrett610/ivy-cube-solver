/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Canvas, MeshProps, PrimitiveProps, useLoader } from '@react-three/fiber';

// import ivyCoreGltf from '../assets/gltf/ivy_core.gltf?url';

// import ivyCornerStubLeftGltf from '../assets/gltf/ivy_corner_stub_x4_l.gltf?url';
// import ivyCornerStubRightGltf from '../assets/gltf/ivy_corner_stub_x4_r.gltf?url';

// import ivyInnerLeftGltf from '../assets/gltf/ivy_inner_x4_l.gltf?url';
// import ivyInnerRightGltf from '../assets/gltf/ivy_inner_x4_r.gltf?url';

import ivyCenterGltf from '../assets/gltf/center.gltf?url';
import ivyCornerGltf from '../assets/gltf/corner.gltf?url';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

import './App.css';

import { absolute, flexCenter, fullSize } from './styles';
import { useEffect, useState } from 'react';
import { MeshBasicMaterial } from 'three';
import * as THREE from 'three';

const useIteration = (fps = 60) => {
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

const colors = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#9400D3',
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Model = (props: ModelProps) => {
  const { url, primitiveProps } = props;
  const gltf = useLoader(GLTFLoader, url);

  // Object.values(gltf.nodes).forEach((node) => {
  //   if (node.material) {
  //     node.material = new MeshBasicMaterial({ color: new THREE.Color(getRandomColor()) });
  //   }
  // });

  // console.log(gltf.materials);
  Object.values(gltf.materials).forEach((material) => {
    const meshMaterial = material as MeshBasicMaterial;

    meshMaterial.color = new THREE.Color('#520B3E');
  });

  return (
    <>
      <primitive object={gltf.scene.clone()} scale={0.1} {...primitiveProps} />;
      <meshStandardMaterial color={'blue'} />
    </>
  );
};

interface SubModelProps extends Omit<PrimitiveProps, 'object'> {}

// const IvyCore = (props: SubModelProps) => {
//   return <Model url={ivyCoreGltf} primitiveProps={props} />;
// };

// const IvyCornerStubLeft = (props: SubModelProps) => {
//   return <Model url={ivyCornerStubLeftGltf} primitiveProps={props} />;
// };

// const IvyCornerStubRight = (props: SubModelProps) => {
//   return <Model url={ivyCornerStubRightGltf} primitiveProps={props} />;
// };

// const IvyInnerLeft = (props: SubModelProps) => {
//   return <Model url={ivyInnerLeftGltf} primitiveProps={props} />;
// };

// const IvyInnerRight = (props: SubModelProps) => {
//   return <Model url={ivyInnerRightGltf} primitiveProps={props} />;
// };

const IvyCenterModel = (props: SubModelProps) => {
  return <Model url={ivyCenterGltf} primitiveProps={props} />;
};

const IvyCornerModel = (props: SubModelProps) => {
  return <Model url={ivyCornerGltf} primitiveProps={props} />;
};

const IvyCenter = (props: MeshProps) => {
  return (
    <mesh {...props}>
      <IvyCenterModel />
    </mesh>
  );
};

const IvyCorner = (props: SubModelProps) => {
  return (
    <mesh {...props}>
      <IvyCornerModel />
    </mesh>
  );
};

// const IvyMainCore = (props: MeshProps) => {
//   return (
//     <mesh {...props}>
//       <IvyCore position={[0, 0, 3]} />
//       <IvyCore position={[0, 0, -3]} rotation={[0, Math.PI, 0]} />
//     </mesh>
//   );
// };

interface IvyCornersProps extends MeshProps {
  offset?: number;
}

const IvyCorners = (props: IvyCornersProps) => {
  const { offset = 5, ...rest } = props;

  return (
    <mesh {...rest}>
      <IvyCorner position={[-offset, -offset, -offset]} rotation={[0, -Math.PI / 2, 0]} />
      <IvyCorner
        position={[offset, offset, -offset]}
        rotation={[0, Math.PI / 2, Math.PI]}
      />
      <IvyCorner
        position={[offset, -offset, offset]}
        rotation={[-Math.PI / 2, Math.PI, 0]}
      />
      <IvyCorner
        position={[-offset, offset, offset]}
        rotation={[Math.PI, -Math.PI / 2, 0]}
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
      <IvyCenter position={[-offset, 0, 0]} rotation={[0, 0, Math.PI]} />
      <IvyCenter position={[offset, 0, 0]} />
      <IvyCenter position={[0, 0, offset]} rotation={[Math.PI / 2, 0, Math.PI / 2]} />
      <IvyCenter position={[0, 0, -offset]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
      <IvyCenter position={[0, offset, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
      <IvyCenter position={[0, -offset, 0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} />
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
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial color="#000000" opacity={0.1} />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;
