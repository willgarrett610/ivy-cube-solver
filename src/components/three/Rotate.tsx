import { useEffect, useRef } from 'react';

import * as THREE from 'three';

export interface RotateProps {
  axis: [number, number, number];
  angle: number;
  children: React.ReactNode;
}

export const Rotate = (props: RotateProps) => {
  const { axis, angle, children } = props;
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = groupRef.current;

    if (group) {
      group.rotation.set(0, 0, 0);
      group.rotateOnAxis(new THREE.Vector3(...props.axis), props.angle);
    }
  }, [axis, angle]);

  return (
    <group ref={groupRef}>
      <mesh>{children}</mesh>
    </group>
  );
};
