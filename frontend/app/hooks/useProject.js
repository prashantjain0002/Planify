import { getData, postData } from "@/lib/fetchUtil";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      console.log(data);

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

export const useProjectQuery = (projectId) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getData(`/projects/${projectId}/tasks`),
  });
};
