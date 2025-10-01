import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./authContext";
import { WorkspaceProvider } from "./workspaceContext";
import { ThemeProvider } from "./ThemeContext";

export const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkspaceProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
