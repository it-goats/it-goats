import { ITag, ITask } from "../types/task";

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

interface TaskApiInput {
  title: string;
  description: string;
  dueDate: Date | string | null;
  tags: string[] | ITag[];
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

export const createTask = (data: TaskApiInput) =>
  axios.post<ITask>("/tasks", data);
