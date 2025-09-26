import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  emailSchema,
  inviteMemberSchema,
  parmsWorkspaceIdSchema,
  tokenSchema,
  workspaceSchema,
} from "../libs/validateSchema.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  acceptGenerateInvite,
  acceptInviteToken,
  createWorkspace,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
} from "../controllers/workspace.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ body: tokenSchema }),
  acceptInviteToken
);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({ params: parmsWorkspaceIdSchema, body: inviteMemberSchema }),
  inviteUserToWorkspace
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ params: parmsWorkspaceIdSchema }),
  acceptGenerateInvite
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);

router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);

router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);

export default router;
