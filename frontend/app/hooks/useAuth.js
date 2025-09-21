import { postData } from "@/lib/fetchUtil";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data) => postData("/auth/register", data),
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (data) => postData("/auth/verify-email", data),
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data) => postData("/auth/login", data),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data) => postData("/auth/reset-password-request", data),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data) => postData("/auth/reset-password", data),
  });
};
