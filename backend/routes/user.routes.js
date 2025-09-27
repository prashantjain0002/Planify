import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  changePassword,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { validateRequest } from "zod-express-middleware";
import {z} from "zod";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);

router.put(
  "/profile",
  authMiddleware,
  validateRequest({
    body: z.object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      profilePicture: z.string().optional(),
    }),
  }),
  updateUserProfile
);

router.put(
  "/change-password",
  authMiddleware,
  validateRequest({
    body: z.object({
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmPassword: z.string(),
    }),
  }),
  changePassword
);

export default router;
