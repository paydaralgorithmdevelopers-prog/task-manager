export enum Role {
  ROOT_ADMIN = "ROOT_ADMIN",
  SCRUM_MASTER = "SCRUM_MASTER",
  DEVELOPER = "DEVELOPER",
  VIEWER = "VIEWER",
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ROOT_ADMIN]: "Root Admin",
  [Role.SCRUM_MASTER]: "Scrum Master",
  [Role.DEVELOPER]: "Developer",
  [Role.VIEWER]: "Viewer",
};

export const ALL_ROLES = Object.values(Role);
