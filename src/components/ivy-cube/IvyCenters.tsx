import { MeshProps } from '@react-three/fiber';
import { StateDto, Turn } from '../../graph/types';
import { cubeColors } from '../../utils';
import { IvyCenter } from './IvyCenter';
import { useScale } from '../../utils/react/hooks';
import { easeInOutCubic, lerp } from '../../utils/math';
import { useEffect } from 'react';
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

const fps = 30;

export interface IvyCentersProps {
  offset?: number;
  meshProps?: MeshProps;
  cubeState: StateDto;
  turn?: Turn;
}

export const IvyCenters = (props: IvyCentersProps) => {
  const { turn, offset = 0, meshProps, cubeState } = props;

  const { value: t, reset, isPlaying } = useScale(0, 1, fps, 2_500);
  const v = easeInOutCubic(t);
  const angle = lerp(0, (2 * Math.PI) / 3, v);

  useEffect(() => {
    if (turn) {
      reset();
    }
  }, [turn, reset]);

  const isTurning = turn && isPlaying && t < 1;

  const turningCenters = turn ? cornerToCenterMapping[turn.corner] : [];
  const turningAxis = turn
    ? cornerAxes[turn.corner]
    : ([0, 0, 0] as [number, number, number]);

  const { centers } = cubeState;

  return (
    <mesh {...meshProps}>
      <Rotate
        angle={isTurning && turningCenters.includes(0) ? angle : 0}
        axis={turningAxis}
      >
        <IvyCenter
          meshProps={{
            position: [0, 0, -offset],
            rotation: [-Math.PI / 2, 0, Math.PI / 2],
          }}
          colors={{ background: cubeColors.internals, face: centerMapping[centers[0]] }}
        />
      </Rotate>
      <Rotate
        angle={isTurning && turningCenters.includes(1) ? angle : 0}
        axis={turningAxis}
      >
        <IvyCenter
          meshProps={{
            position: [0, -offset, 0],
            rotation: [-Math.PI / 2, Math.PI / 2, 0],
          }}
          colors={{ background: cubeColors.internals, face: centerMapping[centers[1]] }}
        />
      </Rotate>
      <Rotate
        angle={isTurning && turningCenters.includes(2) ? angle : 0}
        axis={turningAxis}
      >
        <IvyCenter
          meshProps={{
            position: [0, 0, offset],
            rotation: [Math.PI / 2, 0, Math.PI / 2],
          }}
          colors={{ background: cubeColors.internals, face: centerMapping[centers[2]] }}
        />
      </Rotate>
      <Rotate
        angle={isTurning && turningCenters.includes(3) ? angle : 0}
        axis={turningAxis}
      >
        <IvyCenter
          meshProps={{
            position: [0, offset, 0],
            rotation: [Math.PI / 2, Math.PI / 2, 0],
          }}
          colors={{ background: cubeColors.internals, face: centerMapping[centers[3]] }}
        />
      </Rotate>
      <Rotate
        angle={isTurning && turningCenters.includes(4) ? angle : 0}
        axis={turningAxis}
      >
        <IvyCenter
          meshProps={{
            position: [-offset, 0, 0],
            rotation: [0, 0, Math.PI],
          }}
          colors={{ background: cubeColors.internals, face: centerMapping[centers[4]] }}
        />
      </Rotate>
      <Rotate
        angle={isTurning && turningCenters.includes(5) ? angle : 0}
        axis={turningAxis}
      >
        <IvyCenter
          meshProps={{ position: [offset, 0, 0] }}
          colors={{ background: cubeColors.internals, face: centerMapping[centers[5]] }}
        />
      </Rotate>
    </mesh>
  );
};
