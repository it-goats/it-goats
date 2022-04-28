import { ITag } from "../types/task";
import axios from "axios";

export const getTags = {
  cacheKey: "tags",
  run: () => axios.get<ITag[]>("/tags"),
};
