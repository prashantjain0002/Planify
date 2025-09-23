import { getData, postData } from "@/lib/fetchUtil";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (data) => postData("/workspace", data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => await getData("/workspace"),
  });
};

export const useGetWorkspaceQuery = (workspaceId) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => await getData(`/workspace/${workspaceId}/projects`),
  });
};
