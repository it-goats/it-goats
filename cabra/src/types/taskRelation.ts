import { ITask } from "./task";

export interface ITaskRelation {
  id: string;
  firstTaskId: string;
  secondTaskId: string;
  type: string;
}

export interface IRelatedTask {
  task: ITask;
  relationType: string;
  relationId: string;
}

export enum DirectedRelationType {
  Supertask = "supertask",
  Subtask = "subtask",
  IsBlockedBy = "is_blocked_by",
  Interchangable = "interchangable",
  Blocks = "blocks",
}

export interface IRelatedTasksFlow {
  taskVertex: ITask;
  adjacencyList: Array<{ task: ITask; relationType: string }>;
}
