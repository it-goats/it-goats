interface ITag {
  id: string;
  name: string;
}

export enum TaskStatus {
  TODO = "todo",
  INDIRECTLY_DONE = "indirectly_done",
  DONE = "done",
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: TaskStatus;
  tags: ITag[];
}
