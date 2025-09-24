import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth.middleware.js";
import { parmsProjectIdSchema, parmsTaskIdSchema, taskSchema } from "../libs/validateSchema.js";
import { createTask, getTaskById } from "../controllers/task.controller.js";

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

router.post(
  "/:taskId",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
  }),
  getTaskById
);

export default router;
