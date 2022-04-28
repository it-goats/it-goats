export interface ITag {
  id: string;
  name: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  isDone: boolean;
  tags: ITag[];
}
