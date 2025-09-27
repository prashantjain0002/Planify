import { getData, updateData } from "@/lib/fetchUtil";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => getData("/users/profile"),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => updateData("/users/change-password", data),
  });
};

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: (data) => updateData("/users/profile", data),
  });
};
