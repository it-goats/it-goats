import { CSSProperties, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
} from "react-flow-renderer";

import ELK from "elkjs/lib/elk.bundled.js";
import { IRelatedTasksFlow } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import { randomDOMElementKey } from "../../utils/helperFunctions";

const elk = new ELK();

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

interface IGraph {
  id: string;
  layoutOptions?: unknown;
  children?:
    | Array<{
        id: string;
        width?: number | undefined;
        height?: number | undefined;
        x?: number;
        y?: number;
      }>
    | undefined;
  edges?:
    | Array<{ id: string; sources: Array<string>; targets: Array<string> }>
    | undefined;
}

function createNode(task: ITask): flowNode {
  return {
    id: task.id,
    // type: 'output',
    data: {
      label: task.title,
    },
    position: {
      x: 0,
      y: 0,
    },
  };
}

function createEdge(
  sourceId: string,
  targetId: string,
  animated?: boolean
): flowEdge {
  if (animated) {
    return {
      id: `e${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      animated: true,
      style: { stroke: "black" },
    };
  }
  return {
    id: `e${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    style: { stroke: "black" },
  };
}

function getInitialNodes(
  tasksFlowGraph: IRelatedTasksFlow[],
  nodeDictionary: Map<string, flowNode>
): flowNode[] {
  tasksFlowGraph
    .flatMap(({ taskVertex, adjacencyList }) => {
      nodeDictionary.set(taskVertex.id, createNode(taskVertex));
      return adjacencyList;
    })
    .map(({ task }) => {
      nodeDictionary.set(task.id, createNode(task));
    });
  return Array.from(nodeDictionary.values());
}

const getInitialEdges = function (
  tasksFlowGraph: IRelatedTasksFlow[],
  edgeDictionary: Map<string, flowEdge>
): flowEdge[] {
  tasksFlowGraph.forEach(({ taskVertex, adjacencyList }) => {
    adjacencyList.forEach(({ task, relationType }) => {
      if (relationType.toLowerCase().includes("inter")) {
        const edge = createEdge(taskVertex.id, task.id, true);
        edgeDictionary.set(edge.id, edge);
      } else if (relationType.toLowerCase().includes("isblockedby")) {
        const edge = createEdge(task.id, taskVertex.id);
        edgeDictionary.set(edge.id, edge);
      } else if (relationType.toLowerCase().includes("blocks")) {
        const edge = createEdge(taskVertex.id, task.id);
        edgeDictionary.set(edge.id, edge);
      }
    });
  });
  return Array.from(edgeDictionary.values());
};

const getVerticesNodes = function (tasksFlowGraph: IRelatedTasksFlow[]) {
  return tasksFlowGraph
    .flatMap((e) => e.adjacencyList)
    .map((t) => (
      <h4 key={randomDOMElementKey(t.task.id)}>
        {t.task.title} - {t.relationType}
      </h4>
    ));
};

export default function FlowGraph({ task, tasksFlowGraph }: Props) {
  const nodeDictionary: Map<string, flowNode> = new Map();
  const edgeDictionary: Map<string, flowEdge> = new Map();
  const [nodes, setNodes] = useState(
    getInitialNodes(tasksFlowGraph, nodeDictionary)
  );
  const [edges, setEdges] = useState(
    getInitialEdges(tasksFlowGraph, edgeDictionary)
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const [positions, setPositions] = useState<IGraph | null>(null);

  // const graph = {
  //   id: "root",
  //   layoutOptions: { 'elk.algorithm': 'layered' },
  //   children: nodes.map((node) => ({id: node.id, width: 30, height: 30})),
  //   edges: edges.map((edge) => ({id: edge.id, sources: [edge.source], targets: [edge.target]}))
  // }

  useEffect(() => {
    const graph = {
      id: "root",
      layoutOptions: { "elk.algorithm": "layered" },
      children: nodes.map((node) => ({ id: node.id, width: 30, height: 30 })),
      edges: edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    let isMounted = true;
    elk
      .layout(graph)
      .then((g) => {
        if (isMounted) {
          setPositions(g);

          if (g.children) {
            const children = g.children;

            children?.map((child: { id: string }, i: number) => {
              const node = nodes.find(({ id }) => id === child.id);
              // eslint-disable-next-line no-console
              console.log(`[node: ${node?.data.label}] [child ${i}]`);
            });
          }
        }
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
    return () => {
      isMounted = false;
    };
  }, [edges, nodes]);

  // if (!positions) return null;

  // const { children } = positions;
  // if (!children) return null;

  // children.map((child, i) => {
  //   const node = nodes.find(({ id }) => id === child.id);
  //   // eslint-disable-next-line no-console
  //   console.log(`[node: ${node?.data.label}] [child ${i}]`);
  // });

  // nodes.forEach((node) => {
  //   const graphNode = graph.children.find(({ id }) => id === node.id);
  //   node.position.x = graphNode.x;
  //   node.position.y = graphNode.y;
  // });

  // eslint-disable-next-line no-console
  console.log("Positions: ", positions);

  return (
    <>
      <div>FlowGraph</div>
      Task title: {task.title}
      {/* {tasksFlowGraph.map((el) => (
            <h4 key={randomDOMElementKey(el.taskVertex.id)}>
            {el.taskVertex.title}
            </h4>
        ))} */}
      <br></br>
      Nodess{edges.length}
      <br></br>
      <div>VerticesNodes{getVerticesNodes(tasksFlowGraph)}</div>
      <br></br>
      <br></br>
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
