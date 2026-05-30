'use client';

import { create } from 'zustand';
import { Task, Column } from '../types/kanban.types';

interface KanbanStore {
  columns: Column[];
  setColumns: (columns: Column[]) => void;
  moveTask: (taskId: number, sourceStatus: string, destStatus: string, destIndex: number) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: number) => void;
}

export const useKanbanStore = create<KanbanStore>((set) => ({
  columns: [
    { id: 'backlog', title: 'Backlog', status: 'backlog', tasks: [] },
    { id: 'todo', title: 'To Do', status: 'todo', tasks: [] },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress', tasks: [] },
    { id: 'code_review', title: 'Code Review', status: 'code_review', tasks: [] },
    { id: 'testing', title: 'Testing', status: 'testing', tasks: [] },
    { id: 'blocked', title: 'Blocked', status: 'blocked', tasks: [] },
    { id: 'done', title: 'Done', status: 'done', tasks: [] },
  ],

  setColumns: (columns) => set({ columns }),

  moveTask: (taskId, sourceStatus, destStatus, destIndex) =>
    set((state) => {
      const newColumns = state.columns.map((col) => ({ ...col, tasks: [...col.tasks] }));

      const sourceColumn = newColumns.find((col) => col.status === sourceStatus);
      const destColumn = newColumns.find((col) => col.status === destStatus);

      if (!sourceColumn || !destColumn) return state;

      const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return state;

      const [task] = sourceColumn.tasks.splice(taskIndex, 1);
      task.status = destStatus as Task['status'];
      task.position = destIndex;

      destColumn.tasks.splice(destIndex, 0, task);

      // Update positions
      destColumn.tasks.forEach((t, idx) => {
        t.position = idx;
      });

      return { columns: newColumns };
    }),

  updateTask: (taskId, updates) =>
    set((state) => {
      const newColumns = state.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      }));
      return { columns: newColumns };
    }),

  addTask: (task) =>
    set((state) => {
      const newColumns = state.columns.map((col) => {
        if (col.status === task.status) {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      });
      return { columns: newColumns };
    }),

  removeTask: (taskId) =>
    set((state) => {
      const newColumns = state.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      }));
      return { columns: newColumns };
    }),
}));
