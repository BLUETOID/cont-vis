/**
 * Collision-free tree layout calculation for the Top-Down Recursion DAG
 */

import type { RecursionTreeState, RecursionNode } from '../../types/dp';

export interface LayoutBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

export function computeRecursionTreeLayout(
  tree: RecursionTreeState
): { nodes: Record<string, RecursionNode>; bounds: LayoutBounds } {
  const nodes = { ...tree.nodes };
  const nodeIds = Object.keys(nodes);

  if (nodeIds.length === 0) {
    return {
      nodes,
      bounds: { minX: 0, maxX: 400, minY: 0, maxY: 300, width: 400, height: 300 },
    };
  }

  // Find root nodes (no parentId or parent not in nodes)
  const roots = nodeIds.filter((id) => !nodes[id].parentId || !nodes[nodes[id].parentId!]);
  const rootId = roots[0] || nodeIds[0];

  const LEVEL_HEIGHT = 90;
  const SIBLING_GAP = 120;
  let nextX = 50;

  // Post-order traversal to compute bottom-up subtree width and initial X
  function postOrder(id: string, depth: number) {
    const node = nodes[id];
    node.depth = depth;

    if (!node.childIds || node.childIds.length === 0) {
      node.x = nextX;
      node.y = depth * LEVEL_HEIGHT + 60;
      nextX += SIBLING_GAP;
      return;
    }

    for (const childId of node.childIds) {
      if (nodes[childId]) {
        postOrder(childId, depth + 1);
      }
    }

    // Center parent over children
    const validChildren = node.childIds.filter((cid) => nodes[cid] && nodes[cid].x !== undefined);
    if (validChildren.length > 0) {
      const firstChild = nodes[validChildren[0]];
      const lastChild = nodes[validChildren[validChildren.length - 1]];
      node.x = (firstChild.x! + lastChild.x!) / 2;
      node.y = depth * LEVEL_HEIGHT + 60;
    } else {
      node.x = nextX;
      node.y = depth * LEVEL_HEIGHT + 60;
      nextX += SIBLING_GAP;
    }
  }

  postOrder(rootId, 0);

  // Compute bounding box
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const id of nodeIds) {
    const n = nodes[id];
    if (n.x !== undefined && n.y !== undefined) {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    }
  }

  const padding = 80;
  return {
    nodes,
    bounds: {
      minX: Math.max(0, minX - padding),
      maxX: maxX + padding,
      minY: Math.max(0, minY - padding),
      maxY: maxY + padding,
      width: Math.max(500, maxX - minX + padding * 2),
      height: Math.max(350, maxY - minY + padding * 2),
    },
  };
}
