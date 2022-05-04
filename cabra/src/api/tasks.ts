import { ITask } from "../types/task";
import axios from "axios";

interface TaskApiInput extends Omit<ITask, "id" | "dueDate" | "isBlocked"> {
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

export const deleteTask = (id: string) => axios.delete<ITask>(`/tasks/${id}`);

export const updateTask = (id: string, data: TaskApiInput) =>
  axios.put<ITask>(`/tasks/${id}`, data);

export const createTask = (data: TaskApiInput) =>
  axios.post<ITask>("/tasks", data);
