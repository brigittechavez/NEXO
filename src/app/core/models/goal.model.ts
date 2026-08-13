export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
}

export interface Goal {
  id: string;
  menteeId: string;
  title: string;
  description: string;
  category: string;
  milestones: Milestone[];
  tasks: Task[];
  progress: number;
  createdAt: Date;
}
