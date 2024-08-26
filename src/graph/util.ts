import { StateDto, Turn, TurnDirection } from './types';

export function getTurnFromStateChange(
  startState: StateDto,
  endState: StateDto,
): Turn | null {
  const corner = startState.corners.findIndex((v, i) => v !== endState.corners[i]) as
    | -1
    | 0
    | 1
    | 2
    | 3;

  if (corner === -1) {
    return null;
  }

  const clockwise = endState.corners[corner] === (startState.corners[corner] + 1) % 3;
  return {
    corner,
    turnDirection: clockwise ? TurnDirection.Clockwise : TurnDirection.CounterClockwise,
  };
}
