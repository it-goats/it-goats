import { ITask } from "../types/task";
import { ITaskRelation } from "../types/taskRelation";
import axios from "axios";

interface TaskApiInput extends Omit<ITask, "id" | "dueDate"> {
  dueDate: Date | string | null;
}

export const getTask = {
  cacheKey: (id: string) => ["task", id],
  run: (id: string) => axios.get<ITask>(`/tasks/${id}`),
};

export const getTasks = {
  cacheKey: "tasks",
  run: () => axios.get<ITask[]>("/tasks"),
};

export const getSubtasks = {
  cacheKey: (id: string) => ["tasks", id, "SUBTASK"],
  run: (id: string) => axios.get<ITask[]>(`/tasks/${id}/SUBTASK`),
};

export const deleteTask = (id: string) => axios.delete<ITask>(`/tasks/${id}`);

export const updateTask = (id: string, data: TaskApiInput) =>
  axios.put<ITask>(`/tasks/${id}`, data);

export const createTask = (data: TaskApiInput) =>
  axios.post<ITask>("/tasks", data);

export const createRelation = (data: Omit<ITaskRelation, "id">) =>
  axios.post<ITaskRelation>("/task-relations", data);
