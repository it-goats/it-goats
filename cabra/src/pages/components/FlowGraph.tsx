import { CSSProperties, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
} from "react-flow-renderer";

import ELK from "elkjs/lib/elk.bundled.js";
import { IRelatedTasksFlow } from "../../types/taskRelation";
import { ITask } from "../../types/task";

interface Props {
  task: ITask;
  tasksFlowGraph: IRelatedTasksFlow[];
}

interface flowNode {
  id: string;
  type?: string;
  data: {
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
}

interface flowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: CSSProperties;
}

// interface IGraph {
//   id: string;
//   layoutOptions?: unknown;
//   children?:
//     | Array<{
//         id: string;
//         width?: number | undefined;
//         height?: number | undefined;
//         x?: number;
//         y?: number;
//       }>
//     | undefined;
//   edges?:
//     | Array<{ id: string; sources: Array<string>; targets: Array<string> }>
//     | undefined;
// }

const DEFAULT_NODE_WIDTH = 160;
const DEFAULT_NODE_HEIGHT = 120;

function createFlowNode(
  task: { id: string; title: string },
  position?: { x: number; y: number },
  type?: string
): flowNode {
  const node = {
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

  return node;
}

function createFlowEdge(
  sourceId: string,
  targetId: string,
  animated?: boolean,
  style?: CSSProperties
): flowEdge {
  const edge: {
    id: string;
    source: string;
    target: string;
    animated?: boolean;
    style?: CSSProperties;
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

  return edge;
}

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
      if (relationType.toLowerCase().includes("inter")) {
        const edge = createFlowEdge(taskVertex.id, task.id, true);
        edgeDictionary.set(edge.id, edge);
      } else if (relationType.toLowerCase().includes("isblockedby")) {
        const edge = createFlowEdge(task.id, taskVertex.id);
        edgeDictionary.set(edge.id, edge);
      } else if (relationType.toLowerCase().includes("blocks")) {
        const edge = createFlowEdge(taskVertex.id, task.id);
        edgeDictionary.set(edge.id, edge);
      }
    });
  });
  return Array.from(edgeDictionary.values());
};

const getGraph = function (
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

    const graph = getGraph(initialNodes, initialEdges);

    elk
      .layout(graph)
      .then((g) => {
        if (g.children) {
          const children = g.children;

          children?.map((child: { id: string; x?: number; y?: number }) => {
            if (child.x && child.y) {
              const position = { x: child.x, y: child.y };
              const node = elkNodeDict.get(child.id);
              if (node !== undefined) {
                flowNodeDict.set(
                  child.id,
                  createFlowNode({ id: child.id, title: node.title }, position)
                );
              }
            }
          });
        }

        setNodes(Array.from(flowNodeDict.values()));
        setEdges(Array.from(edgeDict.values()));
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
  }, [tasksFlowGraph]);

  return (
    <>
      Task title: {task.title}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      />
    </>
  );
}
