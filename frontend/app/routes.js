import { index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/auth/AuthLayout.jsx", [
    index("routes/root/Home.jsx"),
    route("sign-in", "routes/auth/SignIn.jsx"),
    route("sign-up", "routes/auth/SignUp.jsx"),
    route("forgot-password", "routes/auth/ForgotPassword.jsx"),
    route("reset-password", "routes/auth/ResetPassword.jsx"),
    route("verify-email", "routes/auth/VerifyEmail.jsx"),
  ]),

  layout("routes/dashboard/DashboardLayout.jsx", [
    route("dashboard", "routes/dashboard/Dashboard.jsx"),
    route("workspaces", "routes/dashboard/workspaces/Workspaces.jsx"),
  ]),
];
