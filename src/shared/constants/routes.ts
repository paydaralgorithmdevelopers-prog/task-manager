// Application Routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  // Organization routes
  ORG_HOME: (orgSlug: string) => `/${orgSlug}`,
  ORG_SETTINGS: (orgSlug: string) => `/${orgSlug}/settings`,

  // Project routes
  PROJECTS: (orgSlug: string) => `/${orgSlug}/projects`,
  PROJECT_DETAIL: (orgSlug: string, projectId: string) => `/${orgSlug}/projects/${projectId}`,
  PROJECT_BOARD: (orgSlug: string, projectId: string) => `/${orgSlug}/projects/${projectId}/board`,
  PROJECT_SPRINTS: (orgSlug: string, projectId: string) => `/${orgSlug}/projects/${projectId}/sprints`,
  PROJECT_SPRINT_DETAIL: (orgSlug: string, projectId: string, sprintId: string) =>
    `/${orgSlug}/projects/${projectId}/sprints/${sprintId}`,
  PROJECT_TASKS: (orgSlug: string, projectId: string) => `/${orgSlug}/projects/${projectId}/tasks`,
  PROJECT_TASK_DETAIL: (orgSlug: string, projectId: string, taskId: string) =>
    `/${orgSlug}/projects/${projectId}/tasks/${taskId}`,
  PROJECT_ANALYTICS: (orgSlug: string, projectId: string) => `/${orgSlug}/projects/${projectId}/analytics`,
  PROJECT_CHAT: (orgSlug: string, projectId: string) => `/${orgSlug}/projects/${projectId}/chat`,
  PROJECT_SETTINGS: (orgSlug: string, projectId: string) => `/${orgSlug}/projects/${projectId}/settings`,

  // Team routes
  TEAMS: (orgSlug: string) => `/${orgSlug}/teams`,
  TEAM_DETAIL: (orgSlug: string, teamId: string) => `/${orgSlug}/teams/${teamId}`,

  // User routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
} as const;

// API Routes
export const API_ROUTES = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_FORGOT_PASSWORD: '/api/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/api/auth/reset-password',

  // Organizations
  ORGANIZATIONS: '/api/organizations',
  ORGANIZATION_DETAIL: (orgId: string) => `/api/organizations/${orgId}`,
  ORGANIZATION_MEMBERS: (orgId: string) => `/api/organizations/${orgId}/members`,

  // Projects
  PROJECTS: '/api/projects',
  PROJECT_DETAIL: (projectId: string) => `/api/projects/${projectId}`,
  PROJECT_MEMBERS: (projectId: string) => `/api/projects/${projectId}/members`,
  PROJECT_SPRINTS: (projectId: string) => `/api/projects/${projectId}/sprints`,
  PROJECT_TASKS: (projectId: string) => `/api/projects/${projectId}/tasks`,

  // Tasks
  TASKS: '/api/tasks',
  TASK_DETAIL: (taskId: string) => `/api/tasks/${taskId}`,
  TASK_COMMENTS: (taskId: string) => `/api/tasks/${taskId}/comments`,
  TASK_WATCHERS: (taskId: string) => `/api/tasks/${taskId}/watchers`,
  TASK_ACTIVITY: (taskId: string) => `/api/tasks/${taskId}/activity`,

  // Chat
  CHAT_ROOMS: '/api/chat/rooms',
  CHAT_MESSAGES: '/api/chat/messages',

  // Notifications
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION_MARK_READ: (notificationId: string) => `/api/notifications/${notificationId}/read`,

  // Analytics
  ANALYTICS: '/api/analytics',

  // Search
  SEARCH: '/api/search',

  // Uploads
  UPLOADS: '/api/uploads',
} as const;
