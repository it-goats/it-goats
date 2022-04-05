import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import TaskDetailsPage from "./pages/TaskDetails";
import TaskEditPage from "./pages/TaskEdit";
import { useRoutes } from "react-router-dom";

export function useAppRoutes() {
  const AppRoutes = useRoutes([
    { path: "/", element: <HomePage /> },
    {
      path: "task",
      children: [
        { path: ":id", element: <TaskDetailsPage /> },
        { path: ":id/edit", element: <TaskEditPage /> },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return AppRoutes;
}

export const routeHelpers = {
  notFound: "/not-found",
  tasks: "/",
  task: {
    details: (id: string) => `/task/${id}`,
    edit: (id: string) => `/task/${id}/edit`,
  },
};
