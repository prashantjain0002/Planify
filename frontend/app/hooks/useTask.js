import { getData, postData, updateData } from "@/lib/fetchUtil";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useAddSubTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await postData(`/tasks/${data.taskId}/add-subtask`, {
        title: data.title,
      });
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(["task", taskId]);
    },
  });
};

export const useTaskByIdQuery = (taskId) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getData(`/tasks/${taskId}`),
  });
};

export const useUpdateTaskTitleMutatuion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/title`, { title: data.title }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};

export const useUpdateTaskDescriptionMutatuion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/description`, {
        description: data.description,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};

export const useUpdateTaskStatusMutatuion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/status`, { status: data.status }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};

export const useUpdateTaskAssigneesMutatuion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/assignees`, {
        assignees: data.assignees,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};

export const useUpdateTaskPriorityMutatuion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/priority`, { priority: data.priority }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};

export const useUpdateSubTaskMutatuion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/subtask/${data.subTaskId}`, {
        completed: data.completed,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};
