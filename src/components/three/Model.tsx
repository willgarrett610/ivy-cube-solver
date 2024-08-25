/* eslint-disable react/no-unknown-property */
import { PrimitiveProps, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export interface ModelProps {
  url: string;
  primitiveProps?: Omit<PrimitiveProps, 'object'>;
}

export const Model = (props: ModelProps) => {
  const { url, primitiveProps } = props;
  const gltf = useLoader(GLTFLoader, url);

  const scene = gltf.scene.clone();

  return <primitive object={scene} scale={0.1} {...primitiveProps} />;
};
