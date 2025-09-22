import express from "express";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validateSchema.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { createWorkspace, getWorkspace } from "../controllers/workspace.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.get(
  "/",
  authMiddleware,
  getWorkspace
);

export default router;
