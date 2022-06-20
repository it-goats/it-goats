import { flowEdge, flowNode } from "../../../types/relationGraph";

import { CSSProperties } from "react";
import { MarkerType } from "react-flow-renderer";

export const DEFAULT_NODE_WIDTH = 300; // 160
export const DEFAULT_NODE_HEIGHT = 120; // 120

export const SUPREME_TASK_COLOUR = "azure";

export const rfStyle = {
  // backgroundColor: '#D0C0F7',
};

export function createFlowNode(
  task: { id: string; title: string },
  position?: { x: number; y: number },
  style?: CSSProperties,
  type?: string,
  sourcePosition?: string,
  targetPosition?: string
): flowNode {
  const node: {
    id: string;
    type: string;
    data: { label: string };
    position: { x: number; y: number };
    sourcePosition?: string;
    targetPosition?: string;
    style?: CSSProperties;
  } = {
    id: task.id,
    type: "default", // 'output'
    data: {
      label: task.title,
    },
    position: {
      x: 0,
      y: 0,
    },
  };

  if (position) {
    node.position = position;
  }

  if (type) {
    node.type = type;
  }

  if (sourcePosition && targetPosition) {
    node.sourcePosition = sourcePosition;
    node.targetPosition = targetPosition;
  }

  if (style) {
    node.style = style;
  }

  return node;
}

export function createFlowEdge(
  sourceId: string,
  targetId: string,
  animated?: boolean,
  style?: CSSProperties,
  type?: "step" | "smoothstep" | "straight" | undefined,
  label?: string | undefined,
  markerEnd?: {
    type: MarkerType;
  }
): flowEdge {
  const edge: {
    id: string;
    source: string;
    target: string;
    animated?: boolean;
    style?: CSSProperties;
    type?: "step" | "smoothstep" | "straight";
    label?: string | undefined;
    markerEnd?: {
      type: MarkerType;
    };
  } = {
    id: `e${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    style: { stroke: "black" },
  };

  if (animated) {
    edge.animated = true;
  }

  if (style) {
    edge.style = style;
  }

  if (type) {
    edge.type = type;
  }

  if (label) {
    edge.label = label;
  }

  if (markerEnd) {
    edge.markerEnd = {
      type: MarkerType.ArrowClosed,
    };
  }

  return edge;
}
