import { MeshProps } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { IvyCornerModel } from './Models';

const meshMapping: Record<
  keyof IvyCornerProps['colors'],
  (mesh: THREE.Mesh) => THREE.Mesh
> = {
  background: (mesh: THREE.Mesh) =>
    mesh.children[0].children[0].children[0] as THREE.Mesh,
  x: (mesh: THREE.Mesh) => mesh.children[0].children[0].children[1] as THREE.Mesh,
  y: (mesh: THREE.Mesh) => mesh.children[0].children[0].children[2] as THREE.Mesh,
  z: (mesh: THREE.Mesh) => mesh.children[0].children[0].children[3] as THREE.Mesh,
};

export interface IvyCornerProps {
  meshProps: MeshProps;
  colors: {
    background: THREE.ColorRepresentation;
    x: THREE.ColorRepresentation;
    y: THREE.ColorRepresentation;
    z: THREE.ColorRepresentation;
  };
  onClick?(side: 0 | 1 | 2 | undefined): void;
  onRightClick?(side: 0 | 1 | 2 | undefined): void;
  onPointerDown?(side: 0 | 1 | 2 | undefined): void;
  onPointerUp?(side: 0 | 1 | 2 | undefined): void;
  onPointerEnter?(side: 0 | 1 | 2 | undefined): void;
  onPointerLeave?(side: 0 | 1 | 2 | undefined): void;
}

export const IvyCorner = (props: IvyCornerProps) => {
  const { colors, meshProps, onClick, onRightClick } = props;

  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const mesh = meshRef.current;

    if (mesh) {
      Object.entries(colors).forEach(([key, color]) => {
        meshMapping[key as keyof IvyCornerProps['colors']](mesh).material =
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.5,
          });
      });
    }
  }, [meshProps, colors]);

  return (
    <mesh
      ref={meshRef}
      {...meshProps}
      onClick={(e) => {
        if (meshRef.current === null) return;

        const clickedMesh = e.object as THREE.Mesh;
        const uuid = clickedMesh.geometry.uuid;

        for (const [key, mapping] of Object.entries(meshMapping)) {
          if (mapping(meshRef.current).geometry.uuid === uuid) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick?.((axesToNumbers as any)[key]);
            e.stopPropagation();
            break;
          }
        }
      }}
      onContextMenu={(e) => {
        if (meshRef.current === null) return;

        const clickedMesh = e.object as THREE.Mesh;
        const uuid = clickedMesh.geometry.uuid;

        for (const [key, mapping] of Object.entries(meshMapping)) {
          if (mapping(meshRef.current).geometry.uuid === uuid) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRightClick?.((axesToNumbers as any)[key]);
            e.stopPropagation();
            break;
          }
        }
      }}
      // onPointerDown={(e) => {
      //   if (meshRef.current === null) return;

      //   const clickedMesh = e.object as THREE.Mesh;
      //   const uuid = clickedMesh.geometry.uuid;

      //   for (const [key, mapping] of Object.entries(meshMapping)) {
      //     if (mapping(meshRef.current).geometry.uuid === uuid) {
      //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //       props.onCornerPointerDown?.((axesToNumbers as any)[key]);
      //       e.stopPropagation();
      //       break;
      //     }
      //   }
      // }}
      // onPointerUp={(e) => {
      //   if (meshRef.current === null) return;

      //   const clickedMesh = e.object as THREE.Mesh;
      //   const uuid = clickedMesh.geometry.uuid;

      //   for (const [key, mapping] of Object.entries(meshMapping)) {
      //     if (mapping(meshRef.current).geometry.uuid === uuid) {
      //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //       props.onCornerPointerUp?.((axesToNumbers as any)[key]);
      //       e.stopPropagation();
      //       break;
      //     }
      //   }
      // }}
      // onPointerEnter={(e) => {
      //   if (meshRef.current === null) return;

      //   const clickedMesh = e.object as THREE.Mesh;
      //   const uuid = clickedMesh.geometry.uuid;

      //   for (const [key, mapping] of Object.entries(meshMapping)) {
      //     if (mapping(meshRef.current).geometry.uuid === uuid) {
      //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //       props.onCornerPointerEnter?.((axesToNumbers as any)[key]);
      //       e.stopPropagation();
      //       break;
      //     }
      //   }
      // }}
      // onPointerLeave={(e) => {
      //   if (meshRef.current === null) return;

      //   const clickedMesh = e.object as THREE.Mesh;
      //   const uuid = clickedMesh.geometry.uuid;

      //   for (const [key, mapping] of Object.entries(meshMapping)) {
      //     if (mapping(meshRef.current).geometry.uuid === uuid) {
      //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //       props.onCornerPointerLeave?.((axesToNumbers as any)[key]);
      //       e.stopPropagation();
      //       break;
      //     }
      //   }
      // }}
    >
      <IvyCornerModel />
    </mesh>
  );
};

const axesToNumbers = {
  background: undefined,
  x: 0,
  y: 1,
  z: 2,
} as const;
