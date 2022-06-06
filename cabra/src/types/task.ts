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
  description: string;
  dueDate: string | null;
  id: string;
  isBlocked: boolean;
  relationTypes: DirectedRelationType[];
  rrule: string | null;
  status: TaskStatus;
  tags: ITag[];
  title: string;
}
