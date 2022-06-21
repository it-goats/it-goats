import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  SUPREME_TASK_COLOUR,
  createFlowEdge,
  createFlowNode,
  mapStringRelationTypeToEnum,
  rfStyle,
} from "./Visualisation";
import {
  DirectedRelationFlowType,
  Props,
  flowEdge,
  flowNode,
} from "../../../types/relationGraph";
import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";
import ReactFlow, {
  MarkerType,
  applyEdgeChanges,
  applyNodeChanges,
} from "react-flow-renderer";
import { useCallback, useEffect, useState } from "react";

import { IRelatedTasksFlow } from "../../../types/taskRelation";

const isSupremeTask = function (taskId: string, motherTaskId: string): boolean {
  return taskId === motherTaskId;
};

function getInitialELKNodes(
  tasksFlowGraph: IRelatedTasksFlow[],
  nodeDict: Map<string, { title: string }>
): { id: string; width: number; height: number }[] {
  const elkNodeDict: Map<
    string,
    { id: string; width: number; height: number }
  > = new Map();

  tasksFlowGraph
    .flatMap(({ taskVertex, adjacencyList }) => {
      elkNodeDict.set(taskVertex.id, {
        id: taskVertex.id,
        width: DEFAULT_NODE_WIDTH,
        height: DEFAULT_NODE_HEIGHT,
      });
      nodeDict.set(taskVertex.id, { title: taskVertex.title });
      return adjacencyList;
    })
    .map(({ task }) => {
      elkNodeDict.set(task.id, {
        id: task.id,
        width: DEFAULT_NODE_WIDTH,
        height: DEFAULT_NODE_HEIGHT,
      });
      nodeDict.set(task.id, { title: task.title });
    });
  return Array.from(elkNodeDict.values());
}

const getEdges = function (
  tasksFlowGraph: IRelatedTasksFlow[],
  edgeDictionary: Map<string, flowEdge>
): flowEdge[] {
  tasksFlowGraph.forEach(({ taskVertex, adjacencyList }) => {
    adjacencyList.forEach(({ task, relationType }) => {
      const relationTypeEnum = mapStringRelationTypeToEnum(relationType);
      if (relationTypeEnum === DirectedRelationFlowType.Interchangable) {
        const edge = createFlowEdge(taskVertex.id, task.id, true, {
          stroke: "black",
        });
        edgeDictionary.set(edge.id, edge);
      } else if (relationTypeEnum === DirectedRelationFlowType.IsBlockedBy) {
        const markerEnd = {
          type: MarkerType.ArrowClosed,
        };
        const edge = createFlowEdge(
          taskVertex.id,
          task.id,
          false,
          { stroke: "black" },
          undefined,
          undefined,
          markerEnd
        );
        edgeDictionary.set(edge.id, edge);
      } else if (relationTypeEnum === DirectedRelationFlowType.Blocks) {
        const markerEnd = {
          type: MarkerType.ArrowClosed,
        };
        const edge = createFlowEdge(
          task.id,
          taskVertex.id,
          false,
          { stroke: "black" },
          undefined,
          undefined,
          markerEnd
        );
        edgeDictionary.set(edge.id, edge);
      } else if (
        relationTypeEnum === DirectedRelationFlowType.Supertask ||
        relationTypeEnum === DirectedRelationFlowType.Subtask
      ) {
        const edge = createFlowEdge(
          task.id,
          taskVertex.id,
          false,
          { stroke: "navy" },
          "straight",
          "subtask",
          undefined,
          { fill: "navy", color: "black", fillOpacity: 0.3 }
        );
        edgeDictionary.set(edge.id, edge);
      }
    });
  });
  return Array.from(edgeDictionary.values());
};

const getELKGraph = function (
  nodes: { id: string; width: number; height: number }[],
  edges: flowEdge[]
) {
  return {
    id: "root",
    layoutOptions: { "elk.algorithm": "layered" },
    children: nodes,
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };
};

const applyNodePositioning = function (
  children: ElkNode[],
  elkNodeDict: Map<string, { title: string }>,
  flowNodeDict: Map<string, flowNode>,
  supremeTaskId: string
) {
  children?.map((child: { id: string; x?: number; y?: number }) => {
    if (child.x && child.y) {
      const position = { x: child.x, y: child.y };
      const node = elkNodeDict.get(child.id);

      if (node !== undefined) {
        const flowNode = createFlowNode(
          { id: child.id, title: node.title },
          position
        );

        if (isSupremeTask(child.id, supremeTaskId)) {
          flowNode.style = {
            background: SUPREME_TASK_COLOUR,
          };
        }

        flowNodeDict.set(child.id, flowNode);
      }
    }
  });
};

export default function FlowGraph({ task, tasksFlowGraph }: Props) {
  const [nodes, setNodes] = useState<flowNode[] | []>([]);
  const [edges, setEdges] = useState<flowEdge[] | []>([]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  useEffect(() => {
    const elk = new ELK();

    const flowNodeDict: Map<string, flowNode> = new Map();
    const elkNodeDict: Map<string, { title: string }> = new Map();
    const edgeDict: Map<string, flowEdge> = new Map();

    const initialNodes = getInitialELKNodes(tasksFlowGraph, elkNodeDict);
    const initialEdges = getEdges(tasksFlowGraph, edgeDict);

    const graph = getELKGraph(initialNodes, initialEdges);

    elk
      .layout(graph)
      .then((g) => {
        const children = g.children;

        if (children) {
          applyNodePositioning(children, elkNodeDict, flowNodeDict, task.id);
        }

        setNodes(Array.from(flowNodeDict.values()).sort());
        setEdges(Array.from(edgeDict.values()));
      })
      .catch((err) => {
        return <div>An error has occurred :c {err}</div>;
      });
  }, [task.id, tasksFlowGraph]);

  return (
    <>
      Task title: {task.title}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        style={rfStyle}
      />
    </>
  );
}
