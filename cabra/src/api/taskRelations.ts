import {
  DirectedRelationType,
  IRelatedTask,
  IRelatedTasksFlow,
  ITaskRelation,
} from "../types/taskRelation";

import axios from "axios";

export const getRelatedTasks = {
  cacheKey: (taskId: string, type: DirectedRelationType) => [
    "task-relations",
    taskId,
    type,
  ],
  run: (taskId: string, type: DirectedRelationType) =>
    axios.get<IRelatedTask[]>(`/task-relations/${taskId}?relationType=${type}`),
};

export const createRelation = (data: Omit<ITaskRelation, "id">) =>
  axios.post<ITaskRelation>("/task-relations", data);

export const deleteRelation = (id: string) =>
  axios.delete<ITaskRelation>(`/task-relations/${id}`);

export const getRelatedTasksFlow = {
  cacheKey: (taskId: string) => ["task-relations-flow", taskId],
  run: (taskId: string) =>
    axios.get<IRelatedTasksFlow[]>(`/task-relations-flow/${taskId}`),
};
