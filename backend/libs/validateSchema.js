import { z } from "zod";

export const parmsWorkspaceIdSchema = z.object({ workspaceId: z.string() });
export const parmsProjectIdSchema = z.object({ projectId: z.string() });
export const parmsTaskIdSchema = z.object({ taskId: z.string() });

export const titleSchema = z.object({ title: z.string() });
export const descriptionSchema = z.object({ description: z.string() });
export const statusSchema = z.object({ status: z.string() });
export const assigneesSchema = z.object({
  assignees: z.array(z.string()),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

export const workspaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
  color: z.string().min(3, "color must be at least 3 characters long"),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
  status: z.enum([
    "Planning",
    "In Progress",
    "On Hold",
    "Completed",
    "Cancelled",
  ]),
  startDate: z.string(),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
  members: z
    .array(
      z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
      })
    )
    .optional(),
});

export const taskSchema = z.object({
  title: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().optional(),
  assignees: z.array(z.string()).min(1, "At least one Assignee is required"),
});
