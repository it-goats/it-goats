import { IFilterFormState } from "../types/filterFormState";
import { ITask } from "../types/task";
import axios from "axios";

export const filtersToUrlParams = (filters: IFilterFormState): string => {
  const params = new URLSearchParams();
  Object.entries(filters)
    .filter(([_, value]) => value)
    .forEach((entry) => params.append(...entry));
  return params.toString();
};

interface TaskApiInput extends Omit<ITask, "id" | "dueDate"> {
  dueDate: Date | string | null;
}

export const getTask = {
  cacheKey: (id: string) => ["task", id],
  run: (id: string) => axios.get<ITask>(`/tasks/${id}`),
};

export const getTasks = {
  cacheKey: (
    filters: IFilterFormState = {
      tagNames: null,
      status: null,
      titlePattern: null,
      dateFrom: null,
      dateTo: null,
    }
  ) => ["tasks", filtersToUrlParams(filters)],
  run: (
    filters: IFilterFormState = {
      tagNames: null,
      status: null,
      titlePattern: null,
      dateFrom: null,
      dateTo: null,
    }
  ) => axios.get<ITask[]>("/tasks?" + filtersToUrlParams(filters)),
};

export const deleteTask = (id: string) => axios.delete<ITask>(`/tasks/${id}`);

export const updateTask = (id: string, data: TaskApiInput) =>
  axios.put<ITask>(`/tasks/${id}`, data);

export const createTask = (data: TaskApiInput) =>
  axios.post<ITask>("/tasks", data);
