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
