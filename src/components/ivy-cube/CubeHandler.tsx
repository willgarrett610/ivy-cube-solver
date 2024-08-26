import { useEffect, useMemo, useState } from 'react';
import { isStateDtoEqual, StateDto } from '../../graph/types';
import { IvyCube } from './IvyCube';
import { getTurnFromStateChange } from '../../graph/util';

export interface CubeHandlerProps {
  state: StateDto;
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

export const CubeHandler = (props: CubeHandlerProps) => {
  const {
    state,
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

  const [stateHistory, setStateHistory] = useState<StateDto[]>([]);

  const prevState = useMemo(() => stateHistory.at(-2), [stateHistory]);

  const turn = useMemo(() => {
    if (!prevState) return undefined;

    return getTurnFromStateChange(prevState, state);
  }, [prevState]);

  useEffect(() => {
    setStateHistory((prev) => {
      const lastState = prev.at(-1);
      if (!lastState || !isStateDtoEqual(state, lastState)) {
        return [...prev, state];
      } else {
        return [...prev];
      }
    });
  }, [state]);

  return (
    <IvyCube
      onCornerClick={onCornerClick}
      onCenterClick={onCenterClick}
      // onCenterPointerDown={onCenterPointerDown}
      // onCenterPointerUp={onCenterPointerUp}
      // onCenterPointerEnter={onCenterPointerEnter}
      // onCenterPointerLeave={onCenterPointerLeave}
      // onCornerPointerDown={onCornerPointerDown}
      // onCornerPointerUp={onCornerPointerUp}
      // onCornerPointerEnter={onCornerPointerEnter}
      // onCornerPointerLeave={onCornerPointerLeave}
      turn={turn}
      prevCubeState={prevState}
      cubeState={state}
    />
  );
};
