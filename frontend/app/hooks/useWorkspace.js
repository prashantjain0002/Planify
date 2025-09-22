import { postData } from "@/lib/fetchUtil";
import { useMutation } from "@tanstack/react-query";

export const useCreateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: (data) => postData("/workspace", data),
  });
};
