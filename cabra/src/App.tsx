import { QueryClient, QueryClientProvider } from "react-query";

import { useAppRoutes } from "./routes";

const queryClient = new QueryClient();

export default function App() {
  const appRoutes = useAppRoutes();

  return (
    <QueryClientProvider client={queryClient}>{appRoutes}</QueryClientProvider>
  );
}
