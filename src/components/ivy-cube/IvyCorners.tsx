import { MeshProps } from '@react-three/fiber';
import { StateDto, Turn } from '../../graph/types';
import { cubeColors } from '../../utils';
import { Vector3 } from '../../utils/math/Vector3';
import { Rotate } from '../three/Rotate';
import { IvyCorner } from './IvyCorner';
import { useScale } from '../../utils/react/hooks';
import { easeInOutCubic } from '../../utils/math';
import { lerp } from 'three/src/math/MathUtils';
import { useEffect, useMemo } from 'react';

const fps = 30;

export const cornerAxes = {
  0: new Vector3(-1, -1, -1).normalized.asTuple,
  1: new Vector3(-1, 1, 1).normalized.asTuple,
  2: new Vector3(1, -1, 1).normalized.asTuple,
  3: new Vector3(1, 1, -1).normalized.asTuple,
};

export interface IvyCornersProps {
  offset?: number;
  meshProps?: MeshProps;
  prevCubeState?: StateDto;
  cubeState: StateDto;
  turn?: Turn;
}

export const IvyCorners = (props: IvyCornersProps) => {
  const { turn, offset = 0, meshProps, prevCubeState, cubeState } = props;

  const { value: t, reset, isPlaying } = useScale(0, 1, fps, 2_500);
  const v = useMemo(() => easeInOutCubic(t), [t]);
  const angle = useMemo(
    () => (turn ? lerp(0, -((2 * Math.PI) / 3) * turn.turnDirection, v) : 0),
    [turn, v],
  );

  useEffect(() => {
    if (turn) {
      reset();
    }
  }, [turn, reset]);

  const isTurning = useMemo(() => turn && isPlaying && t < 1, [turn, isPlaying, t]);

  const { corners } = useMemo(
    () => (isPlaying ? prevCubeState : cubeState) ?? cubeState,
    [isPlaying, prevCubeState, cubeState],
  );

  return (
    <mesh {...meshProps}>
      <Rotate
        angle={
          (-corners[0] * (2 * Math.PI)) / 3 +
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (isTurning && turn!.corner === 0 ? angle : 0)
        }
        axis={cornerAxes[0]}
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
        angle={
          (-corners[1] * (2 * Math.PI)) / 3 +
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (isTurning && turn!.corner === 1 ? angle : 0)
        }
        axis={cornerAxes[1]}
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
        angle={
          (-corners[2] * (2 * Math.PI)) / 3 +
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (isTurning && turn!.corner === 2 ? angle : 0)
        }
        axis={cornerAxes[2]}
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
        angle={
          (-corners[3] * (2 * Math.PI)) / 3 +
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (isTurning && turn!.corner === 3 ? angle : 0)
        }
        axis={cornerAxes[3]}
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
