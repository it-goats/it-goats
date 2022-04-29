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
  IsDependentOn = "is_dependent_on",
  DependsOn = "depends_on",
  Subtask = "subtask",
  Supertask = "supertask",
  Interchangable = "interchangable",
}
