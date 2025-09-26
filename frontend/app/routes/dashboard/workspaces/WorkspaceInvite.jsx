// import Loader from "@/components/Loader";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import WorkspaceAvatar from "@/components/workspace/WorkspaceAvatar";
// import {
//   useAcceptGenerateInviteMutation,
//   useAcceptInviteMemberMutation,
//   useGetWorkspaceDetailsQuery,
// } from "@/hooks/useWorkspace";
// import React from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router";
// import { toast } from "sonner";

// export function meta({}) {
//   return [
//     { title: "Invitation - Planify" },
//     { name: "description", content: "Welcome to Planify" },
//   ];
// }

// const WorkspaceInvite = () => {
//   const { workspaceId } = useParams();

//   const [searchParams] = useSearchParams();

//   const token = searchParams.get("tk");

//   const navigate = useNavigate();

//   const { data: workspace, isLoading } =
//     useGetWorkspaceDetailsQuery(workspaceId);

//   const { data: acceptInviteByToken, isPending: isAcceptInviteByTokenPending } =
//     useAcceptInviteMemberMutation();

//   const {
//     data: acceptGenerateInvite,
//     isPending: isAcceptGenerateInvitePending,
//   } = useAcceptGenerateInviteMutation();

//   const handleAcceptInvite = () => {
//     if (!workspaceId) return;
//     if (token) {
//       acceptGenerateInvite(token, {
//         onSuccess: () => {
//           toast.success("Invitation accepted successfully");
//           navigate(`/workspaces/${workspaceId}`);
//         },
//         onError: (error) => {
//           const errorMessage = error?.message;
//           toast.error(errorMessage);
//         },
//       });
//     } else {
//       acceptGenerateInvite(workspaceId, {
//         onSuccess: () => {
//           toast.success("Invitation accepted successfully");
//           navigate(`/workspaces/${workspaceId}`);
//         },
//       });
//     }
//   };

//   const handleDeclineInvite = () => {
//     toast.info("Invitation Declined");
//     navigate("/workspaces");
//   };

//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader />
//       </div>
//     );

//   if (!workspace) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Card className={"max-w-lg w-full"}>
//           <CardHeader>
//             <CardTitle>Invalid Invitation</CardTitle>
//             <CardDescription>
//               This workspace invitation is invalid or has expired
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <Button
//               onClick={() => navigate(`/dashboard/workspaces/${workspaceId}`)}
//             >
//               Go to Workspace
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <Card className={"max-w-lg w-full"}>
//         <CardHeader>
//           <div className="flex items-center gap-3 mb-2">
//             <WorkspaceAvatar name={workspace.name} color={workspace.color} />
//             <CardTitle>{workspace.name}</CardTitle>
//           </div>
//           <CardDescription>
//             You have been invited to join the "<strong>{workspace.name}</strong>
//             " workspace.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className={"py-4"}>
//           {workspace.description && (
//             <p className="text-sm text-muted-foreground">
//               {workspace.description}
//             </p>
//           )}

//           <div className="flex gap-3">
//             <Button
//               className={"flex-1"}
//               onClick={handleAcceptInvite}
//               disabled={
//                 isAcceptInviteByTokenPending || isAcceptGenerateInvitePending
//               }
//             >
//               {isAcceptInviteByTokenPending || isAcceptGenerateInvitePending
//                 ? "Joining..."
//                 : "Accept Invitation"}
//             </Button>

//             <Button
//               variant={"destructive"}
//               className={"flex-1"}
//               onClick={handleDeclineInvite}
//               disabled={
//                 isAcceptInviteByTokenPending || isAcceptGenerateInvitePending
//               }
//             >
//               Decline
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default WorkspaceInvite;

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WorkspaceAvatar from "@/components/workspace/WorkspaceAvatar";
import {
  useAcceptGenerateInviteMutation,
  useAcceptInviteMemberMutation,
  useGetWorkspaceDetailsQuery,
} from "@/hooks/useWorkspace";
import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function meta() {
  return [
    { title: "Invitation - Planify" },
    { name: "description", content: "Workspace Invitation - Planify" },
  ];
}

const WorkspaceInvite = () => {
  const { workspaceId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("tk");
  const navigate = useNavigate();

  const { data: workspace, isLoading } =
    useGetWorkspaceDetailsQuery(workspaceId);

  // ✅ get both mutation functions + loading states
  const {
    mutate: acceptInviteByToken,
    isPending: isAcceptInviteByTokenPending,
  } = useAcceptInviteMemberMutation();

  const {
    mutate: acceptGenerateInvite,
    isPending: isAcceptGenerateInvitePending,
  } = useAcceptGenerateInviteMutation();

  const handleAcceptInvite = () => {
    if (!workspaceId) return;

    if (token) {
      // ✅ use token-based mutation
      acceptInviteByToken(token, {
        onSuccess: () => {
          toast.success("Invitation accepted successfully");
          navigate(`/workspaces/${workspaceId}`);
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to accept invitation");
        },
      });
    } else {
      // ✅ use workspaceId-based mutation
      acceptGenerateInvite(workspaceId, {
        onSuccess: () => {
          toast.success("Invitation accepted successfully");
          navigate(`/workspaces/${workspaceId}`);
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to accept invitation");
        },
      });
    }
  };

  const handleDeclineInvite = () => {
    toast.info("Invitation Declined");
    navigate("/workspaces");
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <Loader />
      </div>
    );

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <Card className="max-w-lg w-full shadow-lg border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-red-600">
              Invalid Invitation
            </CardTitle>
            <CardDescription>
              This workspace invitation is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button onClick={() => navigate("/workspaces")}>
              Go Back to Workspaces
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-xl border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-3 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex justify-center"
            >
              <WorkspaceAvatar
                name={workspace.name}
                color={workspace.color}
                className="w-16 h-16 ring-4 ring-indigo-100 dark:ring-indigo-900"
              />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              Join <span className="text-indigo-600">{workspace.name}</span>
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              You’ve been invited to collaborate in this workspace.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {workspace.description && (
              <p className="text-sm text-muted-foreground text-center">
                {workspace.description}
              </p>
            )}

            <div className="flex gap-4">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                onClick={handleAcceptInvite}
                disabled={
                  isAcceptInviteByTokenPending || isAcceptGenerateInvitePending
                }
              >
                {isAcceptInviteByTokenPending || isAcceptGenerateInvitePending
                  ? "Joining..."
                  : "Accept Invitation"}
              </Button>

              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                onClick={handleDeclineInvite}
                disabled={
                  isAcceptInviteByTokenPending || isAcceptGenerateInvitePending
                }
              >
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WorkspaceInvite;
