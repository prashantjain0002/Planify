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
import { useForgotPasswordMutation } from "@/hooks/useAuth";
import { forgotPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";

export function meta({}) {
  return [
    { title: "Forgot Password" },
    { name: "description", content: "Forgot your password" },
  ];
}

const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useForgotPasswordMutation();

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || "something went wrong";
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center items-center space-y-2 flex-col">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground">
            Enter your email to reset your password below
          </p>
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
                  Password reset email sent
                </h1>
                <p className="text-muted-foreground">
                  Check your email for a link to reset your password
                </p>
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
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
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

export default ForgotPassword;
