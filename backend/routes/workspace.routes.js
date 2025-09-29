import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  emailSchema,
  inviteMemberSchema,
  parmsWorkspaceIdSchema,
  tokenSchema,
  transferWorkspaceSchema,
  workspaceSchema,
} from "../libs/validateSchema.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  acceptGenerateInvite,
  acceptInviteToken,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
  transferWorkspace,
  updateWorkspace,
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

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ params: parmsWorkspaceIdSchema }),
  acceptGenerateInvite
);

router.put(
  "/:workspaceId",
  authMiddleware,
  validateRequest({ body: workspaceSchema, params: parmsWorkspaceIdSchema }),
  updateWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);

router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);

router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);

router.post(
  "/:workspaceId/transfer",
  authMiddleware,
  validateRequest({
    params: parmsWorkspaceIdSchema,
    body: transferWorkspaceSchema,
  }),
  transferWorkspace
);

router.delete(
  "/:workspaceId",
  authMiddleware,
  validateRequest({ params: parmsWorkspaceIdSchema }),
  deleteWorkspace
);

export default router;
