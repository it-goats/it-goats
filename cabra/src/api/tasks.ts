import { ITask, TaskStatus } from "../types/task";

import { IFilterFormState } from "../types/filterFormState";
import axios from "axios";

export const filtersToUrlParams = (
  filters: Partial<IFilterFormState>
): string => {
  const params = new URLSearchParams();
  Object.entries(filters)
    .filter(([_, value]) => value)
    .forEach(([key, value]) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach((element) => params.append(key, element));
      } else if (value instanceof Date) {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
  return params.toString();
};

export interface TaskApiInput {
  title: string;
  description: string;
  dueDate: Date | string | null;
  tags: string[];
  subtasks: Array<{ title: string; id: string | null }>;
  relatedTasks: Array<{ taskId: string; relationType: string }>;
}

export const getTask = {
  cacheKey: (id: string) => ["task", id],
  run: (id: string) => axios.get<ITask>(`/tasks/${id}`),
};

export const getTasks = {
  cacheKey: (
    filters: Partial<IFilterFormState> = {
      tags: null,
      status: null,
      title: null,
      dateFrom: null,
      dateTo: null,
    }
  ) => ["tasks", filtersToUrlParams(filters)],
  run: (
    filters: Partial<IFilterFormState> = {
      tags: null,
      status: null,
      title: null,
      dateFrom: null,
      dateTo: null,
    }
  ) => {
    const urlParams = filtersToUrlParams(filters);
    return axios.get<ITask[]>("/tasks?" + urlParams);
  },
};

export const deleteTask = (id: string) => axios.delete<ITask>(`/tasks/${id}`);

export const updateTask = (id: string, data: TaskApiInput) =>
  axios.put<ITask>(`/tasks/${id}`, data);

export const updateTaskStatus = (id: string, status: TaskStatus) =>
  axios.put<ITask>(`/tasks/${id}`, { status });

export const createTask = (data: TaskApiInput) =>
  axios.post<ITask>("/tasks", data);
