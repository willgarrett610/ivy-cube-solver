import { MeshProps } from '@react-three/fiber';
import { StateDto } from '../../graph/types';
import { cubeColors } from '../../utils';
import { IvyCenter } from './IvyCenter';

const centerMapping: Record<number, string> = {
  0: cubeColors.blue,
  1: cubeColors.yellow,
  2: cubeColors.green,
  3: cubeColors.white,
  4: cubeColors.orange,
  5: cubeColors.red,
};

export interface IvyCentersProps {
  offset?: number;
  meshProps?: MeshProps;
  cubeState: StateDto;
}

export const IvyCenters = (props: IvyCentersProps) => {
  const { offset = 0, meshProps, cubeState } = props;

  const { centers } = cubeState;

  return (
    <mesh {...meshProps}>
      <IvyCenter
        meshProps={{
          position: [0, 0, -offset],
          rotation: [-Math.PI / 2, 0, Math.PI / 2],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[0]] }}
      />
      <IvyCenter
        meshProps={{
          position: [0, -offset, 0],
          rotation: [-Math.PI / 2, Math.PI / 2, 0],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[1]] }}
      />
      <IvyCenter
        meshProps={{
          position: [0, 0, offset],
          rotation: [Math.PI / 2, 0, Math.PI / 2],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[2]] }}
      />
      <IvyCenter
        meshProps={{
          position: [0, offset, 0],
          rotation: [Math.PI / 2, Math.PI / 2, 0],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[3]] }}
      />
      <IvyCenter
        meshProps={{
          position: [-offset, 0, 0],
          rotation: [0, 0, Math.PI],
        }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[4]] }}
      />
      <IvyCenter
        meshProps={{ position: [offset, 0, 0] }}
        colors={{ background: cubeColors.internals, face: centerMapping[centers[5]] }}
      />
    </mesh>
  );
};
