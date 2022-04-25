import { ITaskRelation, ITasksRelated } from "../types/taskRelation";

import axios from "axios";

export const getSubtasks = {
  cacheKey: (id: string) => ["task-relations", id, "SUBTASK"],
  run: (id: string) =>
    axios.get<ITasksRelated[]>(`/task-relations/${id}/SUBTASK`),
};

export const createRelation = (data: Omit<ITaskRelation, "id">) =>
  axios.post<ITaskRelation>("/task-relations", data);

export const deleteRelation = (id: string) =>
  axios.delete<ITaskRelation>(`/task-relations/${id}`);
