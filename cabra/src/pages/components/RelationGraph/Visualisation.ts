import {
  DirectedRelationFlowType,
  flowEdge,
} from "../../../types/relationGraph";

import { CSSProperties } from "react";
import { MarkerType } from "react-flow-renderer";

export const DEFAULT_NODE_WIDTH = 200; // 160
export const DEFAULT_NODE_HEIGHT = 120; // 120

export const SUPREME_TASK_COLOUR = "azure";

export const rfStyle = {
  // backgroundColor: '#D0C0F7',
};

export function getEdgeId(sourceId: string, targetId: string): string {
  return `e${sourceId}-${targetId}`;
}

export function createFlowNode(
  task: { id: string; title: string },
  position?: { x: number; y: number },
  style?: CSSProperties,
  type?: "default" | "group" | "input" | "output" | undefined,
  parentNode?: string,
  extent?: "parent" | undefined,
  sourcePosition?: string,
  targetPosition?: string
) {
  const node: {
    id: string;
    type: "default" | "group" | "input" | "output" | undefined;
    data: { label: string };
    position: { x: number; y: number };
    style?: CSSProperties;
    parentNode?: string;
    extent?: "parent" | undefined;
    sourcePosition?: string;
    targetPosition?: string;
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

  if (style) {
    node.style = style;
  }

  if (type) {
    node.type = type;
  }

  if (parentNode) {
    node.parentNode = parentNode;
  }

  if (parentNode && extent) {
    node.extent = extent;
  }

  if (sourcePosition && targetPosition) {
    node.sourcePosition = sourcePosition;
    node.targetPosition = targetPosition;
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
  },
  labelBgStyle?: {
    fill: string | undefined;
    color: string | undefined;
    fillOpacity: number | undefined;
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
      color: string;
    };
    labelBgStyle?: {
      fill: string | undefined;
      color: string | undefined;
      fillOpacity: number | undefined;
    };
  } = {
    id: getEdgeId(sourceId, targetId),
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
      color: "black",
    };
  }

  if (labelBgStyle) {
    edge.labelBgStyle = labelBgStyle;
  }

  return edge;
}

export const mapStringRelationTypeToEnum = function (
  relationType: string
): DirectedRelationFlowType | undefined {
  if (relationType.toLowerCase().includes("inter")) {
    return DirectedRelationFlowType.Interchangable;
  }
  if (relationType.toLowerCase().includes("isblockedby")) {
    return DirectedRelationFlowType.IsBlockedBy;
  }
  if (relationType.toLowerCase().includes("blocks")) {
    return DirectedRelationFlowType.Blocks;
  }
  if (relationType.toLowerCase().includes("subtask")) {
    return DirectedRelationFlowType.Subtask;
  }
  if (relationType.toLowerCase().includes("supertask")) {
    return DirectedRelationFlowType.Supertask;
  }
  return undefined;
};
