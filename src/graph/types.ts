export class Edge {
  corner: number;
  clockwise: boolean;
  node: GNode;

  constructor(corner: number, clockwise: boolean, node: GNode) {
    this.corner = corner;
    this.clockwise = clockwise;
    this.node = node;
  }
}

export class GNode {
  state: State;
  neighbors: Edge[];
  distance: number;
  solvePathState?: State;

  constructor(state: State) {
    this.state = state;
    this.neighbors = [];
    this.distance = 0;
    this.solvePathState = undefined;
  }

  getBackEdge(state: State) {
    return this.neighbors.findIndex((edge) => edge.node.state.id === state.id);
  }

  get solvedPath() {
    if (this.solvePathState) return this.getBackEdge(this.solvePathState);
    return undefined;
  }
}

export interface StateDto {
  corners: [number, number, number, number];
  centers: [number, number, number, number, number, number];
}

export function isStateDtoEqual(a: StateDto, b: StateDto) {
  return (
    a.corners.every((v, i) => v === b.corners[i]) &&
    a.centers.every((v, i) => v === b.centers[i])
  );
}

export class State {
  corners: [number, number, number, number];
  centers: [number, number, number, number, number, number];

  static fromDto(dto: StateDto) {
    return new State(dto.corners, dto.centers);
  }

  constructor(
    corners: [number, number, number, number],
    centers: [number, number, number, number, number, number],
  ) {
    this.corners = corners;
    this.centers = centers;
  }

  static solved = () => new State([0, 0, 0, 0], [0, 1, 2, 3, 4, 5]);

  rotateCorner(corner: number, clockwise: boolean) {
    const result = State.fromDto(this.dto);

    result.corners[corner] = (this.corners[corner] + (clockwise ? 1 : 2)) % 3;

    return result;
  }

  rotate(corner: number, clockwise: boolean): State {
    const corners = this.corners.slice() as [number, number, number, number];
    const centers = this.centers.slice() as [
      number,
      number,
      number,
      number,
      number,
      number,
    ];

    corners[corner] = (this.corners[corner] + (clockwise ? 1 : 2)) % 3;

    let swaps: number[] = [];
    switch (corner) {
      case 0:
        swaps = [0, 4, 1];
        break;
      case 1:
        swaps = [4, 3, 2];
        break;
      case 2:
        swaps = [1, 2, 5];
        break;
      case 3:
        swaps = [0, 5, 3];
        break;
    }

    if (clockwise) {
      centers[swaps[0]] = this.centers[swaps[2]];
      centers[swaps[1]] = this.centers[swaps[0]];
      centers[swaps[2]] = this.centers[swaps[1]];
    } else {
      centers[swaps[0]] = this.centers[swaps[1]];
      centers[swaps[1]] = this.centers[swaps[2]];
      centers[swaps[2]] = this.centers[swaps[0]];
    }

    return new State(corners, centers);
  }

  findOrCreate(visited: Map<number, GNode>) {
    if (visited.has(this.id)) {
      return visited.get(this.id) as GNode;
    }

    return new GNode(this);
  }

  get id() {
    return (
      this.corners.map((v, i) => v * 10 ** i).reduce((p, c) => p + c, 0) * 10 ** 6 +
      this.centers.map((v, i) => v * 10 ** i).reduce((p, c) => p + c, 0)
    );
  }

  get dto(): StateDto {
    return {
      corners: this.corners,
      centers: this.centers,
    };
  }
}

export enum TurnDirection {
  Clockwise = 1,
  CounterClockwise = -1,
}

export interface Turn {
  corner: 0 | 1 | 2 | 3;
  turnDirection: TurnDirection;
}
