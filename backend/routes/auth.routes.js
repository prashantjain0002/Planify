import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  loginSchema,
  registerSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../libs/validateSchema.js";
import {
  loginUser,
  registerUser,
  resetPasswordRequest,
  verifyEmail,
  verifyResetPasswordTokenAndResetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest({ body: registerSchema }),
  registerUser
);

router.post("/login", validateRequest({ body: loginSchema }), loginUser);

router.post(
  "/verify-email",
  validateRequest({ body: verifyEmailSchema }),
  verifyEmail
);

router.post(
  "/reset-password-request",
  validateRequest({
    body: resetPasswordRequestSchema,
  }),
  resetPasswordRequest
);

router.post(
  "/reset-password",
  validateRequest({
    body: resetPasswordSchema,
  }),
  verifyResetPasswordTokenAndResetPassword
);

export default router;
