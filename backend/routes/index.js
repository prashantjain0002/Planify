import express from "express";
import authRoutes from "./auth.routes.js";
import workspaceRoutes from "./workspace.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspace", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;
