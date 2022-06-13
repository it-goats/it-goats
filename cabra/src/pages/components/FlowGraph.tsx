import ReactFlow, { applyNodeChanges } from "react-flow-renderer";
import { useCallback, useState } from "react";

import { IRelatedTasksFlow } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import { applyEdgeChanges } from "react-flow-renderer";
import { randomDOMElementKey } from "../../utils/helperFunctions";

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
}

// const initialNodes = [
//     {
//       id: '1',
//       type: 'input',
//       data: { label: 'Input Node' },
//       position: { x: 250, y: 25 },
//     },
//     {
//       id: '2',
//       // you can also pass a React component as a label
//       data: { label: '<div>Default Node</div>' },
//       position: { x: 100, y: 125 },
//     },
//     {
//       id: '3',
//       type: 'output',
//       data: { label: 'Output Node' },
//       position: { x: 250, y: 250 },
//     },
// ];

// const initialEdges = [
//     { id: 'e1-2', source: '1', target: '2' },
//     { id: 'e2-3', source: '2', target: '3', animated: true },
// ];

const getInitialNodes = function (
  tasksFlowGraph: IRelatedTasksFlow[]
): flowNode[] {
  const initialNodes: flowNode[] = [];
  tasksFlowGraph.forEach(({ taskVertex }, index) => {
    const node: flowNode = {
      id: String(index),
      type: "output",
      data: {
        label: taskVertex.title,
      },
      position: {
        x: 100 + Math.random() * 100,
        y: 300 + Math.random() * 100,
      },
    };
    initialNodes.push(node);
  });
  return initialNodes;
};

const getInitialEdges = function (
  tasksFlowGraph: IRelatedTasksFlow[]
): flowEdge[] {
  const initialEdges: flowEdge[] = [];
  tasksFlowGraph.forEach(({ adjacencyList }, idx1) => {
    adjacencyList.forEach((idx2) => {
      const edge: flowEdge = {
        id: `e${idx1}-${idx2}`,
        source: String(idx1),
        target: String(idx2),
      };
      initialEdges.push(edge);
    });
  });
  return initialEdges;
};

export default function FlowGraph({ task, tasksFlowGraph }: Props) {
  const [nodes, setNodes] = useState(getInitialNodes(tasksFlowGraph));
  const [edges, setEdges] = useState(getInitialEdges(tasksFlowGraph));

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return (
    <>
      <div>FlowGraph</div>
      Task title: {task.title}
      {tasksFlowGraph.map((el) => (
        <h4 key={randomDOMElementKey(el.taskVertex.id)}>
          {el.taskVertex.title}
        </h4>
      ))}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      />
      ;
    </>
  );
}
