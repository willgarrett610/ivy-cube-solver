/* eslint-disable react/no-unknown-property */
import { MeshProps } from '@react-three/fiber';

import { StateDto } from '../../graph/types';

import { cubeColors } from '../../utils';
import { lerp } from '../../utils/math';
import { useScale } from '../../utils/react/hooks';
import { IvyCorners } from './IvyCorners';
import { IvyCenters } from './IvyCenters';

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

const offset = 3.85;
const fps = 30;

export interface IvyCubeProps {
  meshProps?: MeshProps;
  cubeState: StateDto;
}

export const IvyCube = (props: IvyCubeProps) => {
  const { meshProps, cubeState } = props;

  const t = useScale(0, 1, fps, 2_500);
  const v = easeOutCubic(t);
  const usedOffset = lerp(50, offset, v);

  return (
    <mesh {...meshProps}>
      <IvyCorners cubeState={cubeState} offset={usedOffset} />
      <IvyCenters cubeState={cubeState} offset={usedOffset} />
      <mesh>
        <sphereGeometry args={[offset, 32, 32]} />
        <meshStandardMaterial color={cubeColors.internals} roughness={0.5} />
      </mesh>
    </mesh>
  );
};
