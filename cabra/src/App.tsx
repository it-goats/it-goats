import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import TaskDetailsPage from "./pages/TaskDetails";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/task/:id" element={<TaskDetailsPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </QueryClientProvider>
  );
}
