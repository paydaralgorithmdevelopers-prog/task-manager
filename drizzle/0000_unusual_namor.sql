CREATE TABLE "push_notifications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "push_notifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"taskId" integer,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"data" jsonb,
	"isRead" boolean DEFAULT false NOT NULL,
	"readAt" timestamp,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "push_subscriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"endpoint" text NOT NULL,
	"auth" varchar(255) NOT NULL,
	"p256dh" varchar(255) NOT NULL,
	"deviceName" varchar(255),
	"deviceType" varchar(50),
	"isActive" boolean DEFAULT true NOT NULL,
	"lastUsedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "realtime_events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "realtime_events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"taskId" integer,
	"teamId" integer,
	"eventType" varchar(100) NOT NULL,
	"eventData" jsonb NOT NULL,
	"broadcastTo" varchar(50) DEFAULT 'user' NOT NULL,
	"isProcessed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reminders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"taskId" integer NOT NULL,
	"userId" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"reminderTime" timestamp NOT NULL,
	"sendAt" timestamp NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"maxAttempts" integer DEFAULT 3 NOT NULL,
	"lastAttemptAt" timestamp,
	"errorMessage" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_tasks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "scheduled_tasks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"taskId" integer NOT NULL,
	"scheduleType" varchar(50) NOT NULL,
	"scheduledFor" timestamp NOT NULL,
	"frequency" varchar(50),
	"dayOfWeek" varchar(50),
	"dayOfMonth" integer,
	"isActive" boolean DEFAULT true NOT NULL,
	"lastRunAt" timestamp,
	"nextRunAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_activity_log" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "task_activity_log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"taskId" integer NOT NULL,
	"userId" integer NOT NULL,
	"action" varchar(100) NOT NULL,
	"changeData" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_assignments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "task_assignments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"taskId" integer NOT NULL,
	"userId" integer NOT NULL,
	"assignedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_comments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "task_comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"taskId" integer NOT NULL,
	"userId" integer NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tasks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'todo' NOT NULL,
	"priority" varchar(50) DEFAULT 'medium' NOT NULL,
	"createdById" integer NOT NULL,
	"assignedToId" integer,
	"teamId" integer,
	"dueDate" timestamp,
	"startDate" timestamp,
	"completedAt" timestamp,
	"estimatedHours" numeric(10, 2),
	"actualHours" numeric(10, 2),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "team_members_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"teamId" integer NOT NULL,
	"userId" integer NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "teams_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text,
	"ownerId" integer NOT NULL,
	"avatar" varchar(500),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_preferences_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"language" varchar(10) DEFAULT 'en' NOT NULL,
	"timezone" varchar(100) DEFAULT 'UTC' NOT NULL,
	"theme" varchar(50) DEFAULT 'auto' NOT NULL,
	"notificationsEnabled" boolean DEFAULT true NOT NULL,
	"emailNotifications" boolean DEFAULT true NOT NULL,
	"pushNotifications" boolean DEFAULT true NOT NULL,
	"soundEnabled" boolean DEFAULT true NOT NULL,
	"dailyDigest" boolean DEFAULT false NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"sessionId" varchar(255) NOT NULL,
	"socketId" varchar(255),
	"userAgent" text,
	"ipAddress" varchar(50),
	"isActive" boolean DEFAULT true NOT NULL,
	"lastActivityAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_sessions_sessionId_unique" UNIQUE("sessionId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"avatar" varchar(500),
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "push_notifications_user_id_idx" ON "push_notifications" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "push_notifications_task_id_idx" ON "push_notifications" USING btree ("taskId");--> statement-breakpoint
CREATE INDEX "push_notifications_is_read_idx" ON "push_notifications" USING btree ("isRead");--> statement-breakpoint
CREATE INDEX "push_notifications_status_idx" ON "push_notifications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "push_subscriptions_endpoint_idx" ON "push_subscriptions" USING btree ("endpoint");--> statement-breakpoint
CREATE INDEX "push_subscriptions_is_active_idx" ON "push_subscriptions" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "realtime_events_user_id_idx" ON "realtime_events" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "realtime_events_task_id_idx" ON "realtime_events" USING btree ("taskId");--> statement-breakpoint
CREATE INDEX "realtime_events_team_id_idx" ON "realtime_events" USING btree ("teamId");--> statement-breakpoint
CREATE INDEX "realtime_events_event_type_idx" ON "realtime_events" USING btree ("eventType");--> statement-breakpoint
CREATE INDEX "realtime_events_is_processed_idx" ON "realtime_events" USING btree ("isProcessed");--> statement-breakpoint
CREATE INDEX "reminders_user_id_idx" ON "reminders" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "reminders_task_id_idx" ON "reminders" USING btree ("taskId");--> statement-breakpoint
CREATE INDEX "reminders_send_at_idx" ON "reminders" USING btree ("sendAt");--> statement-breakpoint
CREATE INDEX "reminders_status_idx" ON "reminders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "scheduled_tasks_task_id_idx" ON "scheduled_tasks" USING btree ("taskId");--> statement-breakpoint
CREATE INDEX "scheduled_tasks_scheduled_for_idx" ON "scheduled_tasks" USING btree ("scheduledFor");--> statement-breakpoint
CREATE INDEX "scheduled_tasks_is_active_idx" ON "scheduled_tasks" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "task_activity_log_task_id_idx" ON "task_activity_log" USING btree ("taskId");--> statement-breakpoint
CREATE INDEX "task_activity_log_user_id_idx" ON "task_activity_log" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "task_assignments_task_id_idx" ON "task_assignments" USING btree ("taskId");--> statement-breakpoint
CREATE INDEX "task_assignments_user_id_idx" ON "task_assignments" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "task_comments_task_id_idx" ON "task_comments" USING btree ("taskId");--> statement-breakpoint
CREATE INDEX "task_comments_user_id_idx" ON "task_comments" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "tasks_status_idx" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tasks_priority_idx" ON "tasks" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "tasks_created_by_idx" ON "tasks" USING btree ("createdById");--> statement-breakpoint
CREATE INDEX "tasks_assigned_to_idx" ON "tasks" USING btree ("assignedToId");--> statement-breakpoint
CREATE INDEX "tasks_team_id_idx" ON "tasks" USING btree ("teamId");--> statement-breakpoint
CREATE INDEX "tasks_due_date_idx" ON "tasks" USING btree ("dueDate");--> statement-breakpoint
CREATE INDEX "team_members_team_id_idx" ON "team_members" USING btree ("teamId");--> statement-breakpoint
CREATE INDEX "team_members_user_id_idx" ON "team_members" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "teams_owner_id_idx" ON "teams" USING btree ("ownerId");--> statement-breakpoint
CREATE UNIQUE INDEX "user_preferences_user_id_idx" ON "user_preferences" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_sessions_user_id_idx" ON "user_sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_sessions_session_id_idx" ON "user_sessions" USING btree ("sessionId");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");