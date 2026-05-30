import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

// ============================================
// ORGANIZATION SCHEMAS
// ============================================

export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').optional(),
  logoUrl: z.string().url('Invalid URL').optional(),
  settings: z.record(z.any()).optional(),
});

// ============================================
// PROJECT SCHEMAS
// ============================================

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  key: z
    .string()
    .min(2, 'Project key must be at least 2 characters')
    .max(10, 'Project key must be at most 10 characters')
    .regex(/^[A-Z]+$/, 'Project key must contain only uppercase letters'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').optional(),
  description: z.string().optional(),
  iconUrl: z.string().url('Invalid URL').optional(),
  status: z.enum(['active', 'archived', 'completed']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// ============================================
// SPRINT SCHEMAS
// ============================================

export const createSprintSchema = z.object({
  name: z.string().min(2, 'Sprint name must be at least 2 characters'),
  goal: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  capacity: z.number().int().positive().optional(),
});

export const updateSprintSchema = z.object({
  name: z.string().min(2, 'Sprint name must be at least 2 characters').optional(),
  goal: z.string().optional(),
  status: z.enum(['planning', 'active', 'completed']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  capacity: z.number().int().positive().optional(),
});

// ============================================
// TASK SCHEMAS
// ============================================

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  type: z.enum(['feature', 'bug', 'chore', 'improvement', 'tech_debt']).default('feature'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z
    .enum(['backlog', 'todo', 'in_progress', 'code_review', 'testing', 'blocked', 'done'])
    .default('backlog'),
  sprintId: z.number().int().positive().optional(),
  assignedTo: z.number().int().positive().optional(),
  storyPoints: z.number().int().positive().optional(),
  estimatedHours: z.number().positive().optional(),
  dueDate: z.string().optional(),
  parentTaskId: z.number().int().positive().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').optional(),
  description: z.string().optional(),
  type: z.enum(['feature', 'bug', 'chore', 'improvement', 'tech_debt']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z
    .enum(['backlog', 'todo', 'in_progress', 'code_review', 'testing', 'blocked', 'done'])
    .optional(),
  sprintId: z.number().int().positive().nullable().optional(),
  assignedTo: z.number().int().positive().nullable().optional(),
  storyPoints: z.number().int().positive().nullable().optional(),
  estimatedHours: z.number().positive().nullable().optional(),
  actualHours: z.number().positive().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  position: z.number().int().optional(),
});

// ============================================
// COMMENT SCHEMAS
// ============================================

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  parentCommentId: z.number().int().positive().optional(),
  mentions: z.array(z.number().int().positive()).optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
});

// ============================================
// CHAT SCHEMAS
// ============================================

export const createChatRoomSchema = z.object({
  type: z.enum(['project', 'team', 'direct']),
  name: z.string().optional(),
  projectId: z.number().int().positive().optional(),
  teamId: z.number().int().positive().optional(),
});

export const createChatMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  mentions: z.array(z.number().int().positive()).optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CreateChatRoomInput = z.infer<typeof createChatRoomSchema>;
export type CreateChatMessageInput = z.infer<typeof createChatMessageSchema>;
