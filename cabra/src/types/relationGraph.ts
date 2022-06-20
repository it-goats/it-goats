import { CSSProperties } from "react";
import { IRelatedTasksFlow } from "./taskRelation";
import { ITask } from "./task";

export interface Props {
  task: ITask;
  tasksFlowGraph: IRelatedTasksFlow[];
}

export interface flowNode {
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

export interface flowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: CSSProperties;
}
