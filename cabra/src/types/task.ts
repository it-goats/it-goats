import { DirectedRelationType } from "./taskRelation";

export interface ITag {
  id: string;
  name: string;
}

export enum TaskStatus {
  TODO = "TODO",
  INDIRECTLY_DONE = "INDIRECTLY_DONE",
  DONE = "DONE",
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: TaskStatus;
  tags: ITag[];
  relationTypes: DirectedRelationType[];
}
