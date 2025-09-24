import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  assigneesSchema,
  descriptionSchema,
  parmsProjectIdSchema,
  parmsTaskIdSchema,
  statusSchema,
  taskSchema,
  titleSchema,
} from "../libs/validateSchema.js";
import {
  createTask,
  getTaskById,
  updateTaskAssignees,
  updateTaskDescription,
  updateTaskStatus,
  updateTaskTitle,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post(
  "/:projectId/create-task",
  authMiddleware,
  validateRequest({
    params: parmsProjectIdSchema,
    body: taskSchema,
  }),
  createTask
);

router.put(
  "/:taskId/title",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
    body: titleSchema,
  }),
  updateTaskTitle
);

router.put(
  "/:taskId/description",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
    body: descriptionSchema,
  }),
  updateTaskDescription
);

router.put(
  "/:taskId/status",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
    body: statusSchema,
  }),
  updateTaskStatus
);

router.put(
  "/:taskId/assignees",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
    body: assigneesSchema,
  }),
  updateTaskAssignees
);

router.get(
  "/:taskId",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
  }),
  getTaskById
);

export default router;
