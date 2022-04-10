export interface ITask {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  isDone: boolean;
}
