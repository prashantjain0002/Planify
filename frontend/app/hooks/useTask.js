import { getData, postData } from "@/lib/fetchUtil";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// export const useCreateTask = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data) => {
//       return await postData(
//         `/tasks/${data.projectId}/create-task`,
//         data.taskData
//       );
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["project", data.project],
//       });
//     },
//   });
// };

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await postData(
        `/tasks/${data.projectId}/create-task`,
        data.taskData
      );
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries(["project", projectId]);
    },
  });
};
