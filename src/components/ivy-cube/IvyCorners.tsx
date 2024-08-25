import { MeshProps } from '@react-three/fiber';
import { StateDto } from '../../graph/types';
import { cubeColors } from '../../utils';
import { Vector3 } from '../../utils/math/Vector3';
import { Rotate } from '../three/Rotate';
import { IvyCorner } from './IvyCorner';

export interface IvyCornersProps {
  offset?: number;
  meshProps?: MeshProps;
  cubeState: StateDto;
}

export const IvyCorners = (props: IvyCornersProps) => {
  const { offset = 0, meshProps, cubeState } = props;

  const { corners } = cubeState;

  return (
    <mesh {...meshProps}>
      <Rotate
        angle={(-corners[0] * (2 * Math.PI)) / 3}
        axis={new Vector3(-1, -1, -1).normalized.asTuple}
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
        angle={(-corners[1] * (2 * Math.PI)) / 3}
        axis={new Vector3(-1, 1, 1).normalized.asTuple}
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
        angle={(-corners[2] * (2 * Math.PI)) / 3}
        axis={new Vector3(1, -1, 1).normalized.asTuple}
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
        angle={(-corners[3] * (2 * Math.PI)) / 3}
        axis={new Vector3(1, 1, -1).normalized.asTuple}
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
