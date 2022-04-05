import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import TaskDetailsPage from "./pages/TaskDetails";
import TaskEditPage from "./pages/TaskEdit";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/task/:id" element={<TaskDetailsPage />} />
      <Route path="/task/:id/edit" element={<TaskEditPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export const routeHelpers = {
  notFound: "/not-found",
  tasks: "/",
  task: {
    details: (id: string) => `/task/${id}`,
    edit: (id: string) => `/task/${id}/edit`,
  },
};
