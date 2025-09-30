import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  parmsProjectIdSchema,
  parmsWorkspaceIdSchema,
  projectSchema,
} from "../libs/validateSchema.js";
import {
  createProject,
  deleteProject,
  getProjectDetails,
  getProjectTasks,
  updateProject,
} from "../controllers/project.controller.js";

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

router.put(
  "/:workspaceId/update-project/:projectId",
  authMiddleware,
  validateRequest({
    params: parmsWorkspaceIdSchema.merge(parmsProjectIdSchema),
    body: projectSchema.partial(),
  }),
  updateProject
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

router.delete(
  "/:workspaceId/delete-project/:projectId",
  authMiddleware,
  validateRequest({
    params: parmsWorkspaceIdSchema.merge(parmsProjectIdSchema),
  }),
  deleteProject
);

export default router;
