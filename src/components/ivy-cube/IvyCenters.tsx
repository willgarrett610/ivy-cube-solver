import { MeshProps } from '@react-three/fiber';
import { StateDto, Turn } from '../../graph/types';
import { cubeColors } from '../../utils';
import { IvyCenter } from './IvyCenter';
import { useScale } from '../../utils/react/hooks';
import { easeInOutCubic, lerp } from '../../utils/math';
import { useEffect, useMemo } from 'react';
import { Rotate } from '../three/Rotate';
import { cornerAxes } from './IvyCorners';

const centerMapping: Record<number, string> = {
  0: cubeColors.blue,
  1: cubeColors.yellow,
  2: cubeColors.green,
  3: cubeColors.white,
  4: cubeColors.orange,
  5: cubeColors.red,
};

const cornerToCenterMapping: Record<number, number[]> = {
  0: [0, 4, 1],
  1: [4, 3, 2],
  2: [1, 2, 5],
  3: [0, 5, 3],
};

interface CenterData {
  position: [number, number, number];
  rotation: [number, number, number];
  colors: {
    background: string;
  };
}

const centersData: CenterData[] = [
  {
    position: [0, 0, -1],
    rotation: [-Math.PI / 2, 0, Math.PI / 2],
    colors: {
      background: cubeColors.internals,
    },
  },
  {
    position: [0, -1, 0],
    rotation: [-Math.PI / 2, Math.PI / 2, 0],
    colors: {
      background: cubeColors.internals,
    },
  },
  {
    position: [0, 0, 1],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
    colors: {
      background: cubeColors.internals,
    },
  },
  {
    position: [0, 1, 0],
    rotation: [Math.PI / 2, Math.PI / 2, 0],
    colors: {
      background: cubeColors.internals,
    },
  },
  {
    position: [-1, 0, 0],
    rotation: [0, 0, Math.PI],
    colors: {
      background: cubeColors.internals,
    },
  },
  {
    position: [1, 0, 0],
    rotation: [0, 0, 0],
    colors: {
      background: cubeColors.internals,
    },
  },
];

const fps = 30;

export interface IvyCentersProps {
  offset?: number;
  meshProps?: MeshProps;
  prevCubeState?: StateDto;
  cubeState: StateDto;
  turn?: Turn;

  onCenterClick?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerDown?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerUp?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerEnter?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
  onCenterPointerLeave?(center: 0 | 1 | 2 | 3 | 4 | 5): void;
}

export const IvyCenters = (props: IvyCentersProps) => {
  const { turn, offset = 0, meshProps, prevCubeState, cubeState, onCenterClick } = props;

  const { value: t, reset, isPlaying } = useScale(0, 1, fps, 1_000);
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

  const turningCenters = useMemo(
    () => (turn ? cornerToCenterMapping[turn.corner] : []),
    [turn],
  );
  const turningAxis = useMemo(
    () => (turn ? cornerAxes[turn.corner] : ([0, 0, 0] as [number, number, number])),
    [turn],
  );

  const { centers } = useMemo(
    () => (isPlaying ? prevCubeState : cubeState) ?? cubeState,
    [isPlaying, prevCubeState, cubeState],
  );

  return (
    <mesh {...meshProps}>
      {centersData.map((centerData, i) => {
        const centerComponent = (
          <IvyCenter
            key={i}
            meshProps={{
              position: centerData.position.map((v) => v * offset) as [
                number,
                number,
                number,
              ],
              rotation: centerData.rotation,
            }}
            colors={{
              background: centerData.colors.background,
              face: centerMapping[centers[i]],
            }}
            onClick={() => onCenterClick?.(i as 0 | 1 | 2 | 3 | 4 | 5)}
            onPointerDown={() => props.onCenterPointerDown?.(i as 0 | 1 | 2 | 3 | 4 | 5)}
            onPointerUp={() => props.onCenterPointerUp?.(i as 0 | 1 | 2 | 3 | 4 | 5)}
            onPointerEnter={() =>
              props.onCenterPointerEnter?.(i as 0 | 1 | 2 | 3 | 4 | 5)
            }
            onPointerLeave={() =>
              props.onCenterPointerLeave?.(i as 0 | 1 | 2 | 3 | 4 | 5)
            }
          />
        );

        if (isTurning && turningCenters.includes(i)) {
          return (
            <Rotate key={i} angle={angle} axis={turningAxis}>
              {centerComponent}
            </Rotate>
          );
        }

        return centerComponent;
      })}
    </mesh>
  );
};
