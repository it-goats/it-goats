import { QueryClient, QueryClientProvider } from "react-query";

import { AppRoutes } from "./routes";
import SettingsProvider from "./pages/components/SettingsContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AppRoutes />
      </SettingsProvider>
    </QueryClientProvider>
  );
}
