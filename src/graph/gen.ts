import { Queue } from 'queue-typescript';
import { Edge, GNode, State } from './types';

export default function genGraph() {
  const visitedNodes = new Map<number, GNode>();

  const solvedState = State.solved();
  const solvedNode = new GNode(solvedState);

  visitedNodes.set(solvedState.id, solvedNode);

  const exploreQ = new Queue<GNode>();

  let maxDistance = 0;
  let maxNode = undefined;

  let next = solvedNode;
  while (next != undefined) {
    visitedNodes.set(next.state.id, next);

    const neighbors = getNeighbors(next, visitedNodes);

    for (const neighbor of neighbors) {
      if (!visitedNodes.has(neighbor.node.state.id)) {
        neighbor.node.distance = next.distance + 1;
        neighbor.node.solvePathState = next.state;
        exploreQ.enqueue(neighbor.node);

        if (neighbor.node.distance > maxDistance) {
          maxDistance = neighbor.node.distance;
          maxNode = neighbor.node;
        }
      }
    }

    next.neighbors = neighbors;
    next = exploreQ.dequeue();
  }

  return solvedNode;
}

function makeEdge(
  corner: number,
  clockwise: boolean,
  state: State,
  visitedNodes: Map<number, GNode>,
) {
  const newNode = state.rotate(corner, clockwise).findOrCreate(visitedNodes);
  return new Edge(corner, clockwise, newNode);
}

function getNeighbors(node: GNode, visitedNodes: Map<number, GNode>) {
  const neighbors: Edge[] = [];

  const state = node.state;

  neighbors.push(makeEdge(0, false, state, visitedNodes));
  neighbors.push(makeEdge(0, true, state, visitedNodes));
  neighbors.push(makeEdge(1, false, state, visitedNodes));
  neighbors.push(makeEdge(1, true, state, visitedNodes));
  neighbors.push(makeEdge(2, false, state, visitedNodes));
  neighbors.push(makeEdge(2, true, state, visitedNodes));
  neighbors.push(makeEdge(3, false, state, visitedNodes));
  neighbors.push(makeEdge(3, true, state, visitedNodes));

  return neighbors;
}

function getSolvePath(node: GNode) {
  const states: State[] = [];

  while (node.distance > 0) {
    states.push(node.state);
    node = node.neighbors[node.solvedPath as number].node;
  }
  states.push(node.state);

  return states;
}
