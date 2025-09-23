import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth.middleware.js";
import { parmsSchema, projectSchema } from "../libs/validateSchema.js";
import { createProject } from "../controllers/project.controller.js";

const router = express.Router();

router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: parmsSchema,
    body: projectSchema,
  }),
  createProject
);

export default router;
