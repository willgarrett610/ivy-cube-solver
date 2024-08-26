/* eslint-disable react/no-unknown-property */
import { MeshProps } from '@react-three/fiber';

import { StateDto, Turn } from '../../graph/types';

import { cubeColors } from '../../utils';
import { easeOutCubic, lerp } from '../../utils/math';
import { useScale } from '../../utils/react/hooks';
import { IvyCorners } from './IvyCorners';
import { IvyCenters } from './IvyCenters';

const offset = 3.85;
const fps = 30;

export interface IvyCubeProps {
  meshProps?: MeshProps;
  prevCubeState?: StateDto;
  cubeState: StateDto;
  turn?: Turn;

  onCornerClick?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCenterClick?(center: 0 | 1 | 2 | 3 | 4 | 5): void;

  onCornerPointerDown?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerUp?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerEnter?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerLeave?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;

  onCenterPointerDown?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerUp?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerEnter?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerLeave?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
}

export const IvyCube = (props: IvyCubeProps) => {
  const {
    meshProps,
    prevCubeState,
    cubeState,
    turn,
    onCornerClick,
    onCenterClick,
    onCenterPointerDown,
    onCenterPointerUp,
    onCenterPointerEnter,
    onCenterPointerLeave,
    onCornerPointerDown,
    onCornerPointerUp,
    onCornerPointerEnter,
    onCornerPointerLeave,
  } = props;

  const { value: t } = useScale(0, 1, fps, 2_500);
  const v = easeOutCubic(t);
  const usedOffset = lerp(50, offset, v);

  return (
    <mesh {...meshProps}>
      <IvyCorners
        onCornerClick={onCornerClick}
        onCornerPointerDown={onCornerPointerDown}
        onCornerPointerUp={onCornerPointerUp}
        onCornerPointerEnter={onCornerPointerEnter}
        onCornerPointerLeave={onCornerPointerLeave}
        prevCubeState={prevCubeState}
        cubeState={cubeState}
        offset={usedOffset}
        turn={turn}
      />
      <IvyCenters
        onCenterClick={onCenterClick}
        onCenterPointerDown={onCenterPointerDown}
        onCenterPointerUp={onCenterPointerUp}
        onCenterPointerEnter={onCenterPointerEnter}
        onCenterPointerLeave={onCenterPointerLeave}
        prevCubeState={prevCubeState}
        cubeState={cubeState}
        offset={usedOffset}
        turn={turn}
      />
      <mesh>
        <sphereGeometry args={[offset, 32, 32]} />
        <meshStandardMaterial color={cubeColors.internals} roughness={0.5} />
      </mesh>
    </mesh>
  );
};
