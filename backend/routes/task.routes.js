import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  parmsProjectIdSchema,
  parmsTaskIdSchema,
  taskSchema,
  titleSchema,
} from "../libs/validateSchema.js";
import {
  createTask,
  getTaskById,
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

router.get(
  "/:taskId",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
  }),
  getTaskById
);

export default router;
