export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  completed: boolean;
  createdAt: Date;
};