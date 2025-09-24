import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  parmsProjectIdSchema,
  parmsWorkspaceIdSchema,
  projectSchema,
} from "../libs/validateSchema.js";
import { createProject, getProjectDetails, getProjectTasks } from "../controllers/project.controller.js";

const router = express.Router();

router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: parmsWorkspaceIdSchema,
    body: projectSchema,
  }),
  createProject
);

router.get(
  "/:projectId",
  authMiddleware,
  validateRequest({
    params: parmsProjectIdSchema,
  }),
  getProjectDetails
);

router.get(
  "/:projectId/tasks",
  authMiddleware,
  validateRequest({
    params: parmsProjectIdSchema,
  }),
  getProjectTasks
);

export default router;
