export interface Task {
  id: number;
  key: string;
  title: string;
  description?: string;
  type: 'feature' | 'bug' | 'chore' | 'improvement' | 'tech_debt';
  status: 'backlog' | 'todo' | 'in_progress' | 'code_review' | 'testing' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  storyPoints?: number;
  estimatedHours?: string;
  actualHours?: string;
  projectId: number;
  sprintId?: number;
  createdBy: number;
  assignedTo?: number;
  dueDate?: string;
  completedAt?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
}

export interface KanbanBoard {
  columns: Column[];
}
