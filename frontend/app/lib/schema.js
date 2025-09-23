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

// export const projectSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters long"),
//   description: z.string().optional(),
//   status: z.nativeEnum(ProjectStatus),
//   startDate: z.string().min(10, "Start date is required"),
//   dueDate: z.string().min(10, "Due date is required"),
//   members: z
//     .array(
//       z.object({
//         user: z.string(),
//         role: z.enum(["manager", "contributor", "viewer"]),
//       })
//     )
//     .optional(),
//   tags: z.string().optional(),
// });

export const projectSchema = z.object({
  title: z.string().min(3),
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
