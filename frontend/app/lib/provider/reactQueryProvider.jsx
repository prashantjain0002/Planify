import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./authContext";
import { WorkspaceProvider } from "./workspaceContext";

export const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkspaceProvider>
          {children} <Toaster richColors />
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
