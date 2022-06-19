import { ISettings } from "../types/settings";
import axios from "axios";

export const updateSettings = (settings: ISettings) =>
  axios.put<ISettings>(`/settings`, settings);

export const getSettings = {
  cacheKey: "settings",
  run: () => axios.get<ISettings>("/settings"),
};
