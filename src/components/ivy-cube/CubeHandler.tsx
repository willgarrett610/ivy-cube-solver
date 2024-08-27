import { useEffect, useMemo } from 'react';
import { StateDto } from '../../graph/types';
import { defaultOffset, IvyCube } from './IvyCube';
import { getTurnFromStateChange } from '../../graph/util';
import { usePrevious } from '@blueprintjs/core';
import { useScale } from '../../utils/react/hooks';
import { easeOutCubic } from '../../utils/math';
import { lerp } from 'three/src/math/MathUtils';
import { ExplodingState, useAppViewModel } from '../../App';
import { observer } from 'mobx-react-lite';

const fps = 30;
export interface CubeHandlerProps {
  state: StateDto;
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

export const CubeHandler = observer((props: CubeHandlerProps) => {
  const {
    state,
    onCornerClick,
    onCenterClick,
    onCornerRightClick,
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

  const prevState = usePrevious(state);

  const turn = useMemo(() => {
    if (!prevState) {
      return undefined;
    }

    return getTurnFromStateChange(prevState, state);
  }, [prevState, state]);

  const { value: t, reset } = useScale(0, 1, fps, 2_500);
  const v = easeOutCubic(t);
  const offset = lerp(50, defaultOffset, v);
  const angle = lerp(Math.PI, 2 * Math.PI, v);
  const coreSize = lerp(0, defaultOffset, v ** 4);

  // this code is so disgusting
  const { value: explodeT, reset: explodeReset } = useScale(
    0,
    1,
    fps,
    appVm.explodingState === ExplodingState.Exploding ? appVm.explodingTimeMs : 0,
  );
  const explodeV = easeOutCubic(explodeT);
  const explodeOffset = lerp(defaultOffset, 50, explodeV);
  const explodeAngle = lerp(2 * Math.PI, Math.PI, explodeV);
  const explodeCoreSize = lerp(defaultOffset, 0, explodeV ** 4);

  useEffect(() => {
    if (appVm.explodingState === ExplodingState.UnExploding) {
      reset();
    }
  }, [appVm.explodingState]);

  useEffect(() => {
    if (appVm.explodingState === ExplodingState.Exploding) {
      explodeReset();
    }
  }, [appVm.explodingState]);

  return (
    <IvyCube
      offset={appVm.explodingState === ExplodingState.Exploding ? explodeOffset : offset}
      angle={appVm.explodingState === ExplodingState.Exploding ? explodeAngle : angle}
      coreSize={
        appVm.explodingState === ExplodingState.Exploding ? explodeCoreSize : coreSize
      }
      onCornerClick={onCornerClick}
      onCenterClick={onCenterClick}
      onCornerRightClick={onCornerRightClick}
      onCenterRightClick={onCenterRightClick}
      onCenterPointerDown={onCenterPointerDown}
      onCenterPointerUp={onCenterPointerUp}
      onCenterPointerEnter={onCenterPointerEnter}
      onCenterPointerLeave={onCenterPointerLeave}
      onCornerPointerDown={onCornerPointerDown}
      onCornerPointerUp={onCornerPointerUp}
      onCornerPointerEnter={onCornerPointerEnter}
      onCornerPointerLeave={onCornerPointerLeave}
      turn={turn}
      cubeState={state}
    />
  );
});
