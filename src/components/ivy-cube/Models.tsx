import { PrimitiveProps } from '@react-three/fiber';
import { Model } from '../three/Model';

import ivyCenterGltf from '../../../assets/gltf/center.gltf?url';
import ivyCornerGltf from '../../../assets/gltf/corner.gltf?url';

export type SubModelProps = Omit<PrimitiveProps, 'object'>;

export const IvyCenterModel = (props: SubModelProps) => {
  return <Model url={ivyCenterGltf} primitiveProps={props} />;
};

export const IvyCornerModel = (props: SubModelProps) => {
  return <Model url={ivyCornerGltf} primitiveProps={props} />;
};
