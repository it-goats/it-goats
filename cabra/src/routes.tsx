import { Route, Routes } from "react-router-dom";

import CalendarPage from "./pages/Calendar";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import TaskCreatePage from "./pages/TaskCreate";
import TaskDetailsPage from "./pages/TaskDetails";
import TaskEditPage from "./pages/TaskEdit";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/task/new" element={<TaskCreatePage />} />
      <Route path="/task/:id" element={<TaskDetailsPage />} />
      <Route path="/task/:id/edit" element={<TaskEditPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export const routeHelpers = {
  calendar: "/calendar",
  notFound: "/not-found",
  tasks: "/",
  task: {
    new: `/task/new`,
    details: (id: string) => `/task/${id}`,
    edit: (id: string) => `/task/${id}/edit`,
  },
};
