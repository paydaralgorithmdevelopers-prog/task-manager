import {
    AnyPgColumn,
    boolean,
    date,
    decimal,
    index,
    inet,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from 'drizzle-orm/pg-core';

// ============================================
// ENUMS
// ============================================

export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended']);
export const themeEnum = pgEnum('theme', ['light', 'dark', 'system']);
export const organizationRoleEnum = pgEnum('organization_role', ['owner', 'admin', 'member']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'pro', 'enterprise']);
export const projectStatusEnum = pgEnum('project_status', ['active', 'archived', 'completed']);
export const teamRoleEnum = pgEnum('team_role', ['lead', 'member']);
export const projectRoleEnum = pgEnum('project_role', [
  'project_manager',
  'scrum_master',
  'team_lead',
  'developer',
  'qa_engineer',
  'product_owner',
  'viewer',
]);
export const sprintStatusEnum = pgEnum('sprint_status', ['planning', 'active', 'completed']);
export const taskTypeEnum = pgEnum('task_type', ['feature', 'bug', 'chore', 'improvement', 'tech_debt']);
export const taskStatusEnum = pgEnum('task_status', [
  'backlog',
  'todo',
  'in_progress',
  'code_review',
  'testing',
  'blocked',
  'done',
]);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high', 'critical']);
export const activityActionEnum = pgEnum('activity_action', [
  'created',
  'updated',
  'deleted',
  'status_changed',
  'assigned',
  'commented',
  'moved',
]);
export const entityTypeEnum = pgEnum('entity_type', ['task', 'comment', 'project', 'sprint', 'user', 'team']);
export const notificationTypeEnum = pgEnum('notification_type', [
  'task_assigned',
  'mention',
  'comment',
  'status_change',
  'due_date',
  'sprint_start',
  'sprint_end',
]);
export const chatRoomTypeEnum = pgEnum('chat_room_type', ['project', 'team', 'direct']);
export const presenceStatusEnum = pgEnum('presence_status', ['online', 'away', 'offline']);

// ============================================
// USERS & AUTHENTICATION
// ============================================

export const users = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    avatarUrl: varchar('avatar_url', { length: 500 }),
    status: userStatusEnum().notNull().default('active'),
    emailVerified: boolean('email_verified').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
  })
);

export const userSessions = pgTable(
  'user_sessions',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshToken: varchar('refresh_token', { length: 500 }).notNull().unique(),
    deviceInfo: jsonb('device_info'),
    ipAddress: inet('ip_address'),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    lastActivity: timestamp('last_activity').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('user_sessions_user_id_idx').on(table.userId),
    refreshTokenIdx: uniqueIndex('user_sessions_refresh_token_idx').on(table.refreshToken),
  })
);

export const userPreferences = pgTable(
  'user_preferences',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    theme: themeEnum().notNull().default('system'),
    language: varchar({ length: 10 }).notNull().default('en'),
    timezone: varchar({ length: 100 }).notNull().default('UTC'),
    notificationSettings: jsonb('notification_settings').default({}),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: uniqueIndex('user_preferences_user_id_idx').on(table.userId),
  })
);

// ============================================
// ORGANIZATIONS & MULTI-TENANCY
// ============================================

export const organizations = pgTable(
  'organizations',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 100 }).notNull().unique(),
    logoUrl: varchar('logo_url', { length: 500 }),
    settings: jsonb().default({}),
    subscriptionTier: subscriptionTierEnum('subscription_tier').notNull().default('free'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex('organizations_slug_idx').on(table.slug),
  })
);

export const organizationMembers = pgTable(
  'organization_members',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: organizationRoleEnum().notNull().default('member'),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
  },
  (table) => ({
    orgUserIdx: uniqueIndex('org_members_org_user_idx').on(table.organizationId, table.userId),
    userIdIdx: index('org_members_user_id_idx').on(table.userId),
  })
);

// ============================================
// PROJECTS & TEAMS
// ============================================

export const projects = pgTable(
  'projects',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: varchar({ length: 255 }).notNull(),
    key: varchar({ length: 10 }).notNull(), // e.g., "PROJ"
    description: text(),
    iconUrl: varchar('icon_url', { length: 500 }),
    status: projectStatusEnum().notNull().default('active'),
    startDate: date('start_date'),
    endDate: date('end_date'),
    createdBy: integer('created_by')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    orgIdIdx: index('projects_org_id_idx').on(table.organizationId),
    keyIdx: index('projects_key_idx').on(table.key),
    orgKeyIdx: uniqueIndex('projects_org_key_idx').on(table.organizationId, table.key),
  })
);

export const teams = pgTable(
  'teams',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    orgIdIdx: index('teams_org_id_idx').on(table.organizationId),
  })
);

export const teamMembers = pgTable(
  'team_members',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    teamId: integer('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: teamRoleEnum().notNull().default('member'),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
  },
  (table) => ({
    teamUserIdx: uniqueIndex('team_members_team_user_idx').on(table.teamId, table.userId),
    userIdIdx: index('team_members_user_id_idx').on(table.userId),
  })
);

export const projectMembers = pgTable(
  'project_members',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: projectRoleEnum().notNull().default('developer'),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
  },
  (table) => ({
    projectUserIdx: uniqueIndex('project_members_project_user_idx').on(table.projectId, table.userId),
    userIdIdx: index('project_members_user_id_idx').on(table.userId),
  })
);

// ============================================
// SPRINTS
// ============================================

export const sprints = pgTable(
  'sprints',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    name: varchar({ length: 255 }).notNull(),
    goal: text(),
    status: sprintStatusEnum().notNull().default('planning'),
    startDate: date('start_date'),
    endDate: date('end_date'),
    capacity: integer(), // Story points
    createdBy: integer('created_by')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    projectIdIdx: index('sprints_project_id_idx').on(table.projectId),
    statusIdx: index('sprints_status_idx').on(table.status),
  })
);

// ============================================
// TASKS
// ============================================

export const tasks = pgTable(
  'tasks',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    key: varchar({ length: 50 }).notNull().unique(), // e.g., "PROJ-123"
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    sprintId: integer('sprint_id').references(() => sprints.id, { onDelete: 'set null' }),
    parentTaskId: integer('parent_task_id').references((): AnyPgColumn => tasks.id, { onDelete: 'cascade' }),
    title: varchar({ length: 500 }).notNull(),
    description: text(),
    type: taskTypeEnum().notNull().default('feature'),
    status: taskStatusEnum().notNull().default('backlog'),
    priority: taskPriorityEnum().notNull().default('medium'),
    storyPoints: integer('story_points'),
    estimatedHours: decimal('estimated_hours', { precision: 10, scale: 2 }),
    actualHours: decimal('actual_hours', { precision: 10, scale: 2 }),
    createdBy: integer('created_by')
      .notNull()
      .references(() => users.id),
    assignedTo: integer('assigned_to').references(() => users.id, { onDelete: 'set null' }),
    dueDate: date('due_date'),
    completedAt: timestamp('completed_at'),
    position: integer().notNull().default(0),
    attachments: jsonb().default([]),
    metadata: jsonb().default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    keyIdx: uniqueIndex('tasks_key_idx').on(table.key),
    projectStatusIdx: index('tasks_project_status_idx').on(table.projectId, table.status),
    sprintStatusIdx: index('tasks_sprint_status_idx').on(table.sprintId, table.status),
    assignedToIdx: index('tasks_assigned_to_idx').on(table.assignedTo),
    dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
    createdByIdx: index('tasks_created_by_idx').on(table.createdBy),
  })
);

// ============================================
// LABELS & TAGS
// ============================================

export const labels = pgTable(
  'labels',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: varchar({ length: 100 }).notNull(),
    color: varchar({ length: 7 }).notNull(), // Hex color
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    orgNameIdx: uniqueIndex('labels_org_name_idx').on(table.organizationId, table.name),
  })
);

export const taskLabels = pgTable(
  'task_labels',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    labelId: integer('label_id')
      .notNull()
      .references(() => labels.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    taskLabelIdx: uniqueIndex('task_labels_task_label_idx').on(table.taskId, table.labelId),
    labelIdIdx: index('task_labels_label_id_idx').on(table.labelId),
  })
);

// ============================================
// COMMENTS
// ============================================

export const comments = pgTable(
  'comments',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    parentCommentId: integer('parent_comment_id').references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
    content: text().notNull(),
    mentions: jsonb().default([]), // Array of user IDs
    attachments: jsonb().default([]),
    edited: boolean().notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    taskIdIdx: index('comments_task_id_idx').on(table.taskId),
    userIdIdx: index('comments_user_id_idx').on(table.userId),
    parentCommentIdx: index('comments_parent_comment_idx').on(table.parentCommentId),
  })
);

export const commentReactions = pgTable(
  'comment_reactions',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    commentId: integer('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    emoji: varchar({ length: 10 }).notNull(),
  },
  (table) => ({
    commentUserEmojiIdx: uniqueIndex('comment_reactions_comment_user_emoji_idx').on(
      table.commentId,
      table.userId,
      table.emoji
    ),
  })
);

// ============================================
// ACTIVITY & AUDIT
// ============================================

export const activityLogs = pgTable(
  'activity_logs',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    entityType: entityTypeEnum('entity_type').notNull(),
    entityId: integer('entity_id').notNull(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    action: activityActionEnum().notNull(),
    changes: jsonb(), // { field, oldValue, newValue }
    ipAddress: inet('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    entityIdx: index('activity_logs_entity_idx').on(table.entityType, table.entityId),
    userIdIdx: index('activity_logs_user_id_idx').on(table.userId),
    orgCreatedIdx: index('activity_logs_org_created_idx').on(table.organizationId, table.createdAt),
  })
);

// ============================================
// NOTIFICATIONS
// ============================================

export const notifications = pgTable(
  'notifications',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum().notNull(),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    link: varchar({ length: 500 }),
    metadata: jsonb().default({}),
    read: boolean().notNull().default(false),
    readAt: timestamp('read_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userReadIdx: index('notifications_user_read_idx').on(table.userId, table.read),
    userCreatedIdx: index('notifications_user_created_idx').on(table.userId, table.createdAt),
  })
);

// ============================================
// CHAT SYSTEM
// ============================================

export const chatRooms = pgTable(
  'chat_rooms',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    type: chatRoomTypeEnum().notNull(),
    name: varchar({ length: 255 }),
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    teamId: integer('team_id').references(() => teams.id, { onDelete: 'cascade' }),
    createdBy: integer('created_by')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    orgIdIdx: index('chat_rooms_org_id_idx').on(table.organizationId),
    projectIdIdx: index('chat_rooms_project_id_idx').on(table.projectId),
    teamIdIdx: index('chat_rooms_team_id_idx').on(table.teamId),
  })
);

export const chatRoomMembers = pgTable(
  'chat_room_members',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    roomId: integer('room_id')
      .notNull()
      .references(() => chatRooms.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
    lastReadAt: timestamp('last_read_at'),
  },
  (table) => ({
    roomUserIdx: uniqueIndex('chat_room_members_room_user_idx').on(table.roomId, table.userId),
    userIdIdx: index('chat_room_members_user_id_idx').on(table.userId),
  })
);

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    roomId: integer('room_id')
      .notNull()
      .references(() => chatRooms.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    content: text().notNull(),
    mentions: jsonb().default([]),
    attachments: jsonb().default([]),
    edited: boolean().notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    roomCreatedIdx: index('chat_messages_room_created_idx').on(table.roomId, table.createdAt),
    userIdIdx: index('chat_messages_user_id_idx').on(table.userId),
  })
);

// ============================================
// REAL-TIME PRESENCE
// ============================================

export const userPresence = pgTable(
  'user_presence',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    socketId: varchar('socket_id', { length: 255 }).notNull().unique(),
    status: presenceStatusEnum().notNull().default('online'),
    currentPage: varchar('current_page', { length: 500 }),
    lastActivity: timestamp('last_activity').notNull().defaultNow(),
    connectedAt: timestamp('connected_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('user_presence_user_id_idx').on(table.userId),
    socketIdIdx: uniqueIndex('user_presence_socket_id_idx').on(table.socketId),
  })
);

export const taskViewers = pgTable(
  'task_viewers',
  {
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lastViewedAt: timestamp('last_viewed_at').notNull().defaultNow(),
  },
  (table) => ({
    pk: uniqueIndex('task_viewers_pk').on(table.taskId, table.userId),
  })
);

// ============================================
// FILE ATTACHMENTS
// ============================================

export const attachments = pgTable(
  'attachments',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    uploadedBy: integer('uploaded_by')
      .notNull()
      .references(() => users.id),
    filename: varchar({ length: 255 }).notNull(),
    filePath: varchar('file_path', { length: 1000 }).notNull(),
    fileSize: integer('file_size').notNull(), // bytes
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    entityType: entityTypeEnum('entity_type').notNull(),
    entityId: integer('entity_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    entityIdx: index('attachments_entity_idx').on(table.entityType, table.entityId),
    uploadedByIdx: index('attachments_uploaded_by_idx').on(table.uploadedBy),
  })
);

// ============================================
// TASK DEPENDENCIES
// ============================================

export const taskDependencies = pgTable(
  'task_dependencies',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    dependsOnTaskId: integer('depends_on_task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    taskDependencyIdx: uniqueIndex('task_dependencies_task_dependency_idx').on(
      table.taskId,
      table.dependsOnTaskId
    ),
    dependsOnIdx: index('task_dependencies_depends_on_idx').on(table.dependsOnTaskId),
  })
);

// ============================================
// TASK WATCHERS
// ============================================

export const taskWatchers = pgTable(
  'task_watchers',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    taskUserIdx: uniqueIndex('task_watchers_task_user_idx').on(table.taskId, table.userId),
    userIdIdx: index('task_watchers_user_id_idx').on(table.userId),
  })
);

// Type exports for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Sprint = typeof sprints.$inferSelect;
export type NewSprint = typeof sprints.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type NewChatRoom = typeof chatRooms.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
