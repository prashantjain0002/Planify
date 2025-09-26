import { getData, postData } from "@/lib/fetchUtil";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (data) => postData("/workspace", data),
  });
};

export const useInviteMemberMutation = () => {
  return useMutation({
    mutationFn: async (data) =>
      postData(`/workspace/${data.workspaceId}/invite-member`, data),
  });
};

export const useAcceptInviteMemberMutation = () => {
  return useMutation({
    mutationFn: async (token) =>
      postData(`/workspace/accept-invite-token`, { token }),
  });
};

export const useAcceptGenerateInviteMutation = () => {
  return useMutation({
    mutationFn: async (workspaceId) =>
      postData(`/workspace/${workspaceId}/accept-generate-invite`, {}),
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

export const useGetWorkspaceStatusQuery = (workspaceId) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "status"],
    queryFn: async () => await getData(`/workspace/${workspaceId}/stats`),
  });
};

export const useGetWorkspaceDetailsQuery = (workspaceId) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => await getData(`/workspace/${workspaceId}`),
  });
};
