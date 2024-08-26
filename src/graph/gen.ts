import { Queue } from 'queue-typescript';
import { Edge, GNode, State } from './types';

export function genGraph() {
  console.log('Generating graph...');

  const seenNodes = new Map<number, GNode>();

  const solvedState = State.solved();
  const solvedNode = new GNode(solvedState);

  seenNodes.set(solvedState.id, solvedNode);

  const exploreQ = new Queue<GNode>();

  let maxDistance = 0;
  let maxNode = undefined;

  seenNodes.set(solvedNode.state.id, solvedNode);

  let next = solvedNode;
  while (next != undefined) {
    const neighbors = getNeighbors(next, seenNodes);

    for (const neighbor of neighbors) {
      if (!seenNodes.has(neighbor.node.state.id)) {
        seenNodes.set(neighbor.node.state.id, neighbor.node);
        exploreQ.enqueue(neighbor.node);

        neighbor.node.distance = next.distance + 1;
        neighbor.node.solvePathState = next.state;

        if (neighbor.node.distance > maxDistance) {
          maxDistance = neighbor.node.distance;
          maxNode = neighbor.node;
        }
      }
    }

    next.neighbors = neighbors;
    next = exploreQ.dequeue();
  }

  console.log(maxNode);

  return seenNodes;
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

export function getSolvePath(node: GNode) {
  const states: State[] = [];

  while (node.distance > 0) {
    states.push(node.state);
    node = node.neighbors[node.solvedPath as number].node;
  }
  states.push(node.state);

  return states;
}
