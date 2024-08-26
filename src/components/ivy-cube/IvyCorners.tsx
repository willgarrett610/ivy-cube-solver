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

interface CornerData {
  position: [number, number, number];
  rotation: [number, number, number];
  colors: {
    background: string;
    x: string;
    y: string;
    z: string;
  };
}

const cornersData: CornerData[] = [
  {
    position: [-1, -1, -1],
    rotation: [0, -Math.PI / 2, 0],
    colors: {
      background: cubeColors.internals,
      x: cubeColors.orange,
      y: cubeColors.blue,
      z: cubeColors.yellow,
    },
  },
  {
    position: [-1, 1, 1],
    rotation: [Math.PI, -Math.PI / 2, 0],
    colors: {
      background: cubeColors.internals,
      x: cubeColors.orange,
      y: cubeColors.green,
      z: cubeColors.white,
    },
  },
  {
    position: [1, -1, 1],
    rotation: [-Math.PI / 2, Math.PI, 0],
    colors: {
      background: cubeColors.internals,
      x: cubeColors.yellow,
      y: cubeColors.red,
      z: cubeColors.green,
    },
  },
  {
    position: [1, 1, -1],
    rotation: [0, Math.PI / 2, Math.PI],
    colors: {
      background: cubeColors.internals,
      x: cubeColors.red,
      y: cubeColors.blue,
      z: cubeColors.white,
    },
  },
];

export interface IvyCornersProps {
  offset?: number;
  meshProps?: MeshProps;
  prevCubeState?: StateDto;
  cubeState: StateDto;
  turn?: Turn;

  onCornerClick?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerDown?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerUp?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerEnter?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
  onCornerPointerLeave?(corner: 0 | 1 | 2 | 3, side: 0 | 1 | 2 | undefined): void;
}

export const IvyCorners = (props: IvyCornersProps) => {
  const {
    turn,
    offset = 0,
    meshProps,
    prevCubeState,
    cubeState,
    onCornerClick,
    onCornerPointerDown,
    onCornerPointerUp,
    onCornerPointerEnter,
    onCornerPointerLeave,
  } = props;

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
      {cornersData.map((cornerData, i) => {
        const { position, rotation, colors } = cornerData;

        const cornerStateRotation = (-corners[i] * (2 * Math.PI)) / 3;

        return (
          <Rotate
            key={i}
            angle={
              cornerStateRotation +
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- turn is defined if isTurning is true
              (isTurning && turn!.corner === i ? angle : 0)
            }
            axis={cornerAxes[i as 0 | 1 | 2 | 3]}
          >
            <IvyCorner
              onCornerClick={(side) => onCornerClick?.(i as 0 | 1 | 2 | 3, side)}
              onCornerPointerDown={(side) =>
                onCornerPointerDown?.(i as 0 | 1 | 2 | 3, side)
              }
              onCornerPointerUp={(side) => onCornerPointerUp?.(i as 0 | 1 | 2 | 3, side)}
              onCornerPointerEnter={(side) =>
                onCornerPointerEnter?.(i as 0 | 1 | 2 | 3, side)
              }
              onCornerPointerLeave={(side) =>
                onCornerPointerLeave?.(i as 0 | 1 | 2 | 3, side)
              }
              key={i}
              meshProps={{
                position: position.map((v) => v * offset) as [number, number, number],
                rotation,
              }}
              // I do not know why the spread is necessary here, but it is
              colors={colors}
            />
          </Rotate>
        );
      })}
    </mesh>
  );
};
