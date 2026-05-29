import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

// ============================================
// USERS & TEAMS
// ============================================

export const usersTable = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar({ length: 255 }).notNull(),
    avatar: varchar({ length: 500 }),
    role: varchar({ length: 50 }).default("user").notNull(),
    status: varchar({ length: 50 }).default("active").notNull(), // active, inactive, banned
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

export const teamsTable = pgTable(
  "teams",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    ownerId: integer().notNull(),
    avatar: varchar({ length: 500 }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    ownerIdIdx: index("teams_owner_id_idx").on(table.ownerId),
  })
);

export const teamMembersTable = pgTable(
  "team_members",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    teamId: integer().notNull(),
    userId: integer().notNull(),
    role: varchar({ length: 50 }).default("member").notNull(), // owner, admin, member
    joinedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    teamIdIdx: index("team_members_team_id_idx").on(table.teamId),
    userIdIdx: index("team_members_user_id_idx").on(table.userId),
  })
);

// ============================================
// TASKS & TASK MANAGEMENT
// ============================================

export const tasksTable = pgTable(
  "tasks",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    status: varchar({ length: 50 }).default("todo").notNull(), // todo, in_progress, in_review, done, blocked
    priority: varchar({ length: 50 }).default("medium").notNull(), // low, medium, high, urgent
    createdById: integer().notNull(),
    assignedToId: integer(),
    teamId: integer(),
    dueDate: timestamp(),
    startDate: timestamp(),
    completedAt: timestamp(),
    estimatedHours: numeric({ precision: 10, scale: 2 }),
    actualHours: numeric({ precision: 10, scale: 2 }),
    tags: jsonb().default([]), // For categorization
    attachments: jsonb().default([]), // File URLs
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index("tasks_status_idx").on(table.status),
    priorityIdx: index("tasks_priority_idx").on(table.priority),
    createdByIdx: index("tasks_created_by_idx").on(table.createdById),
    assignedToIdx: index("tasks_assigned_to_idx").on(table.assignedToId),
    teamIdIdx: index("tasks_team_id_idx").on(table.teamId),
    dueDateIdx: index("tasks_due_date_idx").on(table.dueDate),
  })
);

export const taskAssignmentsTable = pgTable(
  "task_assignments",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer().notNull(),
    userId: integer().notNull(),
    assignedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    taskIdIdx: index("task_assignments_task_id_idx").on(table.taskId),
    userIdIdx: index("task_assignments_user_id_idx").on(table.userId),
  })
);

export const taskCommentsTable = pgTable(
  "task_comments",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer().notNull(),
    userId: integer().notNull(),
    content: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    taskIdIdx: index("task_comments_task_id_idx").on(table.taskId),
    userIdIdx: index("task_comments_user_id_idx").on(table.userId),
  })
);

export const taskActivityLog = pgTable(
  "task_activity_log",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer().notNull(),
    userId: integer().notNull(),
    action: varchar({ length: 100 }).notNull(), // created, updated, commented, status_changed, assigned
    changeData: jsonb(), // Store what changed: {field: "status", oldValue: "todo", newValue: "in_progress"}
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    taskIdIdx: index("task_activity_log_task_id_idx").on(table.taskId),
    userIdIdx: index("task_activity_log_user_id_idx").on(table.userId),
  })
);

// ============================================
// SCHEDULING & REMINDERS
// ============================================

export const scheduledTasksTable = pgTable(
  "scheduled_tasks",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer().notNull(),
    scheduleType: varchar({ length: 50 }).notNull(), // once, daily, weekly, monthly, custom
    scheduledFor: timestamp().notNull(),
    frequency: varchar({ length: 50 }), // For recurring tasks
    dayOfWeek: varchar({ length: 50 }), // For weekly tasks
    dayOfMonth: integer(), // For monthly tasks
    isActive: boolean().default(true).notNull(),
    lastRunAt: timestamp(),
    nextRunAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    taskIdIdx: index("scheduled_tasks_task_id_idx").on(table.taskId),
    scheduledForIdx: index("scheduled_tasks_scheduled_for_idx").on(
      table.scheduledFor
    ),
    isActiveIdx: index("scheduled_tasks_is_active_idx").on(table.isActive),
  })
);

export const remindersTable = pgTable(
  "reminders",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer().notNull(),
    userId: integer().notNull(),
    type: varchar({ length: 50 }).notNull(), // email, push, in_app, sms
    reminderTime: timestamp().notNull(),
    sendAt: timestamp().notNull(),
    status: varchar({ length: 50 }).default("pending").notNull(), // pending, sent, failed, cancelled
    attempts: integer().default(0).notNull(),
    maxAttempts: integer().default(3).notNull(),
    lastAttemptAt: timestamp(),
    errorMessage: text(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("reminders_user_id_idx").on(table.userId),
    taskIdIdx: index("reminders_task_id_idx").on(table.taskId),
    sendAtIdx: index("reminders_send_at_idx").on(table.sendAt),
    statusIdx: index("reminders_status_idx").on(table.status),
  })
);

// ============================================
// PUSH NOTIFICATIONS
// ============================================

export const pushSubscriptionsTable = pgTable(
  "push_subscriptions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull(),
    endpoint: text().notNull(),
    auth: varchar({ length: 255 }).notNull(),
    p256dh: varchar({ length: 255 }).notNull(),
    deviceName: varchar({ length: 255 }),
    deviceType: varchar({ length: 50 }), // web, mobile, desktop
    isActive: boolean().default(true).notNull(),
    lastUsedAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("push_subscriptions_user_id_idx").on(table.userId),
    endpointIdx: index("push_subscriptions_endpoint_idx").on(table.endpoint),
    isActiveIdx: index("push_subscriptions_is_active_idx").on(table.isActive),
  })
);

export const pushNotificationsTable = pgTable(
  "push_notifications",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull(),
    taskId: integer(),
    title: varchar({ length: 255 }).notNull(),
    message: text().notNull(),
    type: varchar({ length: 50 }).notNull(), // task_assigned, task_due, task_updated, comment_added, reminder
    data: jsonb(), // Additional data like task details, action URLs
    isRead: boolean().default(false).notNull(),
    readAt: timestamp(),
    status: varchar({ length: 50 }).default("pending").notNull(), // pending, sent, failed, cancelled
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("push_notifications_user_id_idx").on(table.userId),
    taskIdIdx: index("push_notifications_task_id_idx").on(table.taskId),
    isReadIdx: index("push_notifications_is_read_idx").on(table.isRead),
    statusIdx: index("push_notifications_status_idx").on(table.status),
  })
);

// ============================================
// WEBSOCKET & REAL-TIME EVENTS
// ============================================

export const userSessionsTable = pgTable(
  "user_sessions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull(),
    sessionId: varchar({ length: 255 }).notNull().unique(),
    socketId: varchar({ length: 255 }),
    userAgent: text(),
    ipAddress: varchar({ length: 50 }),
    isActive: boolean().default(true).notNull(),
    lastActivityAt: timestamp().defaultNow().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_sessions_user_id_idx").on(table.userId),
    sessionIdIdx: index("user_sessions_session_id_idx").on(table.sessionId),
  })
);

export const realtimeEventsTable = pgTable(
  "realtime_events",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull(),
    taskId: integer(),
    teamId: integer(),
    eventType: varchar({ length: 100 }).notNull(), // task_created, task_updated, task_deleted, status_changed, comment_added
    eventData: jsonb().notNull(), // Full event payload
    broadcastTo: varchar({ length: 50 }).default("user").notNull(), // user, team, public
    isProcessed: boolean().default(false).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("realtime_events_user_id_idx").on(table.userId),
    taskIdIdx: index("realtime_events_task_id_idx").on(table.taskId),
    teamIdIdx: index("realtime_events_team_id_idx").on(table.teamId),
    eventTypeIdx: index("realtime_events_event_type_idx").on(table.eventType),
    isProcessedIdx: index("realtime_events_is_processed_idx").on(
      table.isProcessed
    ),
  })
);

// ============================================
// PREFERENCES & NOTIFICATIONS SETTINGS
// ============================================

export const userPreferencesTable = pgTable(
  "user_preferences",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull().unique(),
    language: varchar({ length: 10 }).default("en").notNull(),
    timezone: varchar({ length: 100 }).default("UTC").notNull(),
    theme: varchar({ length: 50 }).default("auto").notNull(), // light, dark, auto
    notificationsEnabled: boolean().default(true).notNull(),
    emailNotifications: boolean().default(true).notNull(),
    pushNotifications: boolean().default(true).notNull(),
    soundEnabled: boolean().default(true).notNull(),
    dailyDigest: boolean().default(false).notNull(),
    preferences: jsonb().default({}), // Custom preferences
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("user_preferences_user_id_idx").on(table.userId),
  })
);
