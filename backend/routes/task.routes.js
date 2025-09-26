import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  assigneesSchema,
  commentSchema,
  descriptionSchema,
  parmsProjectIdSchema,
  parmsResourceIdSchema,
  parmsSubTaskIdSchema,
  parmsTaskIdSchema,
  prioritySchema,
  statusSchema,
  subTaskSchema,
  subTaskUpdateSchema,
  taskSchema,
  titleSchema,
} from "../libs/validateSchema.js";
import {
  addComment,
  addSubTask,
  archiveTask,
  createTask,
  getActivityByResourceId,
  getCommentByTaskId,
  getMyTasks,
  getTaskById,
  updateSubTask,
  updateTaskAssignees,
  updateTaskDescription,
  updateTaskPriority,
  updateTaskStatus,
  updateTaskTitle,
  watchTask,
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

router.post(
  "/:taskId/add-subtask",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
    body: subTaskSchema,
  }),
  addSubTask
);

router.post(
  "/:taskId/add-comment",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
    body: commentSchema,
  }),
  addComment
);

router.post(
  "/:taskId/watch",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
  }),
  watchTask
);

router.post(
  "/:taskId/archive",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
  }),
  archiveTask
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

router.put(
  "/:taskId/priority",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
    body: prioritySchema,
  }),
  updateTaskPriority
);

router.put(
  "/:taskId/subtask/:subTaskId",
  authMiddleware,
  validateRequest({
    params: parmsSubTaskIdSchema,
    body: subTaskUpdateSchema,
  }),
  updateSubTask
);

router.get("/my-tasks", authMiddleware, getMyTasks);

router.get(
  "/:taskId",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
  }),
  getTaskById
);

router.get(
  "/:resourceId/activity",
  authMiddleware,
  validateRequest({
    params: parmsResourceIdSchema,
  }),
  getActivityByResourceId
);

router.get(
  "/:taskId/comments",
  authMiddleware,
  validateRequest({
    params: parmsTaskIdSchema,
  }),
  getCommentByTaskId
);

export default router;
