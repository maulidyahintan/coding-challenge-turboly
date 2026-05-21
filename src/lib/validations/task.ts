import { z } from "zod";

const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

const dueDateSchema = z
  .string()
  .trim()
  .min(1, "Due date is required.")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid due date.");

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title must be at most 120 characters."),
  description: z
    .string()
    .trim()
    .max(400, "Description must be at most 400 characters.")
    .optional()
    .or(z.literal("")),
  priority: prioritySchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});
