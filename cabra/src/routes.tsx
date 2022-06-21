import { Route, Routes } from "react-router-dom";

import CalendarPage from "./pages/Calendar";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import RelationFlow from "./pages/RelationFlow";
import SettingsPage from "./pages/Settings";
import TaskCreatePage from "./pages/TaskCreate";
import TaskDetailsPage from "./pages/TaskDetails";
import TaskEditPage from "./pages/TaskEdit";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/relation-flow" element={<RelationFlow />} />
      <Route path="/task/new" element={<TaskCreatePage />} />
      <Route path="/task/:id" element={<TaskDetailsPage />} />
      <Route path="/task/:id/edit" element={<TaskEditPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export const routeHelpers = {
  calendar: "/calendar",
  relationFlow: "/relation-flow",
  notFound: "/not-found",
  tasks: "/",
  task: {
    new: (date?: Date) =>
      date
        ? `/task/new?date=${encodeURIComponent(date.toISOString())}`
        : `/task/new`,
    details: (id: string) => `/task/${id}`,
    edit: (id: string) => `/task/${id}/edit`,
  },
  settings: "/settings",
};
