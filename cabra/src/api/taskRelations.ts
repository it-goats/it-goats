import {
  DirectedRelationType,
  IRelatedTask,
  ITaskRelation,
} from "../types/taskRelation";

import axios from "axios";

export const getSubtasks = {
  cacheKey: (id: string) => ["task-relations", id, "subtask"],
  run: (id: string) =>
    axios.get<IRelatedTask[]>(`/task-relations/${id}?relationType=subtask`),
};

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
