/* eslint-disable react/no-unknown-property */
import { MeshProps } from '@react-three/fiber';

import { StateDto, Turn } from '../../graph/types';

import { cubeColors } from '../../utils';
import { IvyCorners } from './IvyCorners';
import { IvyCenters } from './IvyCenters';
import { Mode, useAppViewModel } from '../../App';
import { observer } from 'mobx-react-lite';
import { Rotate } from '../three/Rotate';
import { Vector3 } from '../../utils/math/Vector3';

export const defaultOffset = 3.85;

export interface IvyCubeProps {
  meshProps?: MeshProps;
  cubeState: StateDto;
  turn?: Turn;

  offset?: number;
  angle?: number;
  coreSize?: number;

  onCornerClick?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCenterClick?(center: 0 | 1 | 2 | 3 | 4 | 5): void;

  onCornerRightClick?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCenterRightClick?(center: 0 | 1 | 2 | 3 | 4 | 5): void;

  onCornerPointerDown?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerUp?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerEnter?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerLeave?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;

  onCenterPointerDown?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerUp?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerEnter?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerLeave?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
}

export const IvyCube = observer((props: IvyCubeProps) => {
  const {
    meshProps,
    cubeState,
    turn,
    angle = 0,
    coreSize = defaultOffset,
    offset = defaultOffset,
    onCornerClick,
    onCornerRightClick,
    onCenterClick,
    onCenterRightClick,
    onCenterPointerDown,
    onCenterPointerUp,
    onCenterPointerEnter,
    onCenterPointerLeave,
    onCornerPointerDown,
    onCornerPointerUp,
    onCornerPointerEnter,
    onCornerPointerLeave,
  } = props;

  const appVm = useAppViewModel();

  const usedTurn = appVm.doNotTurnPls ? undefined : turn;

  return (
    <mesh {...meshProps}>
      <Rotate axis={Vector3.ones().normalized.asTuple} angle={angle}>
        <IvyCorners
          onCornerClick={onCornerClick}
          onCornerRightClick={onCornerRightClick}
          onCornerPointerDown={onCornerPointerDown}
          onCornerPointerUp={onCornerPointerUp}
          onCornerPointerEnter={onCornerPointerEnter}
          onCornerPointerLeave={onCornerPointerLeave}
          cubeState={cubeState}
          offset={offset}
          turn={usedTurn}
        />
        <IvyCenters
          onCenterClick={onCenterClick}
          onCenterRightClick={onCenterRightClick}
          onCenterPointerDown={onCenterPointerDown}
          onCenterPointerUp={onCenterPointerUp}
          onCenterPointerEnter={onCenterPointerEnter}
          onCenterPointerLeave={onCenterPointerLeave}
          cubeState={cubeState}
          offset={offset}
          turn={appVm.mode !== Mode.Edit ? usedTurn : undefined}
        />
      </Rotate>
      <mesh>
        <sphereGeometry args={[coreSize, 32, 32]} />
        <meshStandardMaterial color={cubeColors.internals} roughness={0.5} />
      </mesh>
    </mesh>
  );
});
