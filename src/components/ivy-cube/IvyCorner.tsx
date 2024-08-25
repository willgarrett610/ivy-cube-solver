import { MeshProps } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { IvyCornerModel } from './Models';

export interface IvyCornerProps {
  meshProps: MeshProps;
  colors: {
    background: THREE.ColorRepresentation;
    x: THREE.ColorRepresentation;
    y: THREE.ColorRepresentation;
    z: THREE.ColorRepresentation;
  };
}

export const IvyCorner = (props: IvyCornerProps) => {
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
