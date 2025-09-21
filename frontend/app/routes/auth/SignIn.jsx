import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/provider/authContext";

export function meta({}) {
  return [
    { title: "Log In" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const SignIn = () => {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation();
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleOnSubmit = (values) => {
    mutate(values, {
      onSuccess: (data) => {
        login(data);
        form.reset();
        toast.success("Logged In Successfully");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4 w-full">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Please enter your email and password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className=" text-blue-500 font-semibold hover:underline hover:text-blue-600 text-sm"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="**********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2" /> : "Log In"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className="mx-auto flex items-center justify-center">
            Don't have an account?
            <Link
              to="/sign-up"
              className="ml-1 text-blue-500 font-semibold hover:underline hover:text-blue-600"
            >
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
