import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/hooks/useAuth";
import { resetPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

export function meta({}) {
  return [
    { title: "Reset Password" },
    { name: "description", content: "Reset your password" },
  ];
}

const ResetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const token = searchParams.get("token");

  const { mutate, isPending } = useResetPasswordMutation();

  const onSubmit = (data) => {
    if (!token) {
      toast.error("Token not found");
    }
    mutate(
      { ...data, token },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center items-center space-y-2 flex-col">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">Enter your password below</p>
        </div>

        <Card>
          <CardHeader>
            <Link
              to="/sign-in"
              className="flex items-center gap-2 hover:underline hover:text-blue-500 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              <p className="text-sm ">Back to Sign In</p>
            </Link>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h1 className="text-2xl font-bold">
                  Password reset successfully
                </h1>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form
                    action=""
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      name="newPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="**************"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="confirmPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="**************"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
