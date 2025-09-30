import { deleteData, getData, postData, updateData } from "@/lib/fetchUtil";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await postData(
        `/projects/${data.workspaceId}/create-project`,
        data.projectData
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.workspace],
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, projectId, projectData }) => {
      return await updateData(
        `/projects/${workspaceId}/update-project/${projectId}`,
        projectData
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};

export const useProjectQuery = (projectId) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getData(`/projects/${projectId}/tasks`),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, projectId }) => {
      return await deleteData(
        `/projects/${workspaceId}/delete-project/${projectId}`,
        {}
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
    },
  });
};
