import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useVerifyEmailMutation } from "@/hooks/useAuth";
import { ArrowLeft, CheckCircle, Loader, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

export function meta({}) {
  return [
    { title: "Verify Email" },
    { name: "description", content: "Verify your email" },
  ];
}

const VerifyEmail = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, isPending: isVerifying } = useVerifyEmailMutation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      mutate(
        { token },
        {
          onSuccess: () => {
            setIsSuccess(true);
          },
          onError: (error) => {
            const errorMessage =
              error?.response?.data?.message || "something went wrong";
            setIsSuccess(false);
            console.log(error);
            toast.error(errorMessage);
          },
        }
      );
      setIsSuccess(false);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Verify Email</h1>
      {/* <p className="text-sm text-gray-500">Verifying your email...</p> */}

      <Card className={"w-full max-w-md"}>
        <CardHeader>
          {/* <Link to={"/sign-in"} className="flex items-center gap-3 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link> */}
        </CardHeader>

        <CardContent>
          <div className="flex flex-col py-6 items-center justify-center">
            {isVerifying ? (
              <>
                <Loader className="animate-spin text-gray-500 w-12 h-12" />
                <h3 className="text-lg font-semibold">Verifying email...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email.
                </p>
              </>
            ) : isSuccess ? (
              <div className="flex flex-col items-center gap-1">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500">
                  Your email has been verified successfully
                </p>
                <Link to={"/sign-in"} className="text-blue-500 text-sm mt-4">
                  <Button variant={"outline"}> Back to Sign In</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <XCircle className="w-12 h-12 text-red-500" />
                <h3 className="text-lg font-semibold">
                  Email Verification Failed
                </h3>
                <p className="text-sm text-gray-500">
                  Your email verification failed. Please try again
                </p>

                <Link to={"/sign-in"} className="text-blue-500 text-sm mt-4">
                  <Button variant={"outline"}> Back to Sign In</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
