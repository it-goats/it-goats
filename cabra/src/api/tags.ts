import { ITag } from "../types/task";
import axios from "axios";

export const deleteTag = (id: string) => (data: Omit<ITag, "id">) =>
  axios.delete<ITag>(`/tasks/${id}/tags`, { data: data });

export const createTag = (id: string) => (data: Omit<ITag, "id">) =>
  axios.post<ITag>(`/tasks/${id}/tags`, data);

export const getTags = {
  cacheKey: "tags",
  run: () => axios.get<ITag[]>("/tags"),
};
