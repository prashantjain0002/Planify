import { index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home/Home.jsx"),
  layout("routes/auth/AuthLayout.jsx", [
    route("sign-in", "routes/auth/SignIn.jsx"),
    route("sign-up", "routes/auth/SignUp.jsx"),
    route("forgot-password", "routes/auth/ForgotPassword.jsx"),
    route("reset-password", "routes/auth/ResetPassword.jsx"),
    route("verify-email", "routes/auth/VerifyEmail.jsx"),
  ]),

  layout("routes/dashboard/DashboardLayout.jsx", [
    route("dashboard", "routes/dashboard/Dashboard.jsx"),
    route("workspaces", "routes/dashboard/workspaces/Workspaces.jsx"),
    route(
      "workspaces/:workspaceId",
      "routes/dashboard/workspaces/WorkspaceDetails.jsx"
    ),
    route(
      "workspace/:workspaceId/projects/:projectId",
      "routes/dashboard/project/ProjectDetails.jsx"
    ),
    route(
      "workspace/:workspaceId/projects/:projectId/tasks/:taskId",
      "routes/dashboard/task/TaskDetails.jsx"
    ),
    route("my-tasks", "routes/dashboard/MyTasks.jsx"),
    route("members", "routes/dashboard/Members.jsx"),
    route("archived", "routes/dashboard/ArchivedTasks.jsx"),
    route("settings", "routes/dashboard/Settings.jsx"),
  ]),

  route(
    "workspace-invite/:workspaceId",
    "routes/dashboard/workspaces/WorkspaceInvite.jsx"
  ),

  layout("routes/user/UserLayout.jsx", [
    route("user/profile", "routes/user/Profile.jsx"),
  ]),
];
