import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import TaskDetailsPage from "./pages/TaskDetails";
import TaskEditPage from "./pages/TaskEdit";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/task/:id" element={<TaskDetailsPage />} />
        <Route path="/task/:id/edit" element={<TaskEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
