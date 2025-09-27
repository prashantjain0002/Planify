import { z } from "zod";

export const ProjectStatus = {
  Planning: "Planning",
  InProgress: "In Progress",
  OnHold: "On Hold",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    name: z.string().min(3, "Name must be at least 3 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const workspaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  color: z.string().min(3, "Color must be at least 3 characters long"),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.date({ required_error: "Start date is required" }),
  dueDate: z.date().optional(),
  members: z
    .array(
      z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
      })
    )
    .optional(),
  tags: z.string().optional(),
});

// export const taskSchema = z.object({
//   title: z.string().min(3, "Task must be at least 3 characters long"),
//   description: z.string().optional(),
//   status: z.enum(["To Do", "In Progress", "Done"]),
//   priority: z.enum(["Low", "Medium", "High"]),
//   dueDate: z.string().min(1, "Due date is required"),
//   assigness: z.array(z.string()).min(1, "At least one Assignees are required"),
// });

export const taskSchema = z.object({
  title: z.string().min(3, "Task must be at least 3 characters long"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z
    .union([z.date(), z.string()]) // accept both Date & string
    .optional(),
  assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "member", "viewer"]),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const profileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  profilePicture: z.string().optional(),
});
