import { Queue } from 'queue-typescript';

function genGraph() {
  const visitedNodes = new Map<State, GNode>();

  const solvedState = State.solved();
  const solvedNode = new GNode(solvedState);

  visitedNodes.set(solvedState, solvedNode);

  const exploreQ = new Queue<GNode>();
  exploreQ.enqueue(solvedNode);

  let next;
  while ((next = exploreQ.dequeue()) != null) {
    visitedNodes.set(next.state, next);

    const neighbors = getNeighbors(next, visitedNodes);

    for (const neighbor of neighbors) {
      if (!visitedNodes.has(neighbor.state)) {
        exploreQ.enqueue(neighbor);
      }
    }

    next.neighbors = neighbors;
  }

  return solvedNode;
}

function getNeighbors(node: GNode, visitedNodes: Map<State, GNode>) {
  const neighbors: GNode[] = [];

  const state = node.state;

  neighbors.push(state.rotate(0, false).findOrCreate(visitedNodes));
  neighbors.push(state.rotate(0, true).findOrCreate(visitedNodes));
  neighbors.push(state.rotate(1, false).findOrCreate(visitedNodes));
  neighbors.push(state.rotate(1, true).findOrCreate(visitedNodes));
  neighbors.push(state.rotate(2, false).findOrCreate(visitedNodes));
  neighbors.push(state.rotate(2, true).findOrCreate(visitedNodes));
  neighbors.push(state.rotate(3, false).findOrCreate(visitedNodes));
  neighbors.push(state.rotate(3, true).findOrCreate(visitedNodes));

  return neighbors;
}
