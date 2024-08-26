import { MeshProps } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { IvyCenterModel } from './Models';

export interface IvyCenterProps {
  meshProps: MeshProps;
  colors: { background: THREE.ColorRepresentation; face: THREE.ColorRepresentation };
  onClick?(): void;
  onRightClick?(): void;
  onPointerDown?(): void;
  onPointerUp?(): void;
  onPointerEnter?(): void;
  onPointerLeave?(): void;
}

export const IvyCenter = (props: IvyCenterProps) => {
  const {
    colors,
    meshProps,
    onClick,
    onRightClick,
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
  } = props;

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
    <mesh
      ref={meshRef}
      {...meshProps}
      onClick={(e) => {
        onClick?.();
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        onRightClick?.();
        e.stopPropagation();
      }}
      // onPointerDown={(e) => {
      //   onPointerDown?.();
      //   e.stopPropagation();
      // }}
      // onPointerUp={(e) => {
      //   onPointerUp?.();
      //   e.stopPropagation();
      // }}
      // onPointerEnter={(e) => {
      //   onPointerEnter?.();
      //   e.stopPropagation();
      // }}
      // onPointerLeave={(e) => {
      //   onPointerLeave?.();
      //   e.stopPropagation();
      // }}
    >
      <IvyCenterModel />
    </mesh>
  );
};
