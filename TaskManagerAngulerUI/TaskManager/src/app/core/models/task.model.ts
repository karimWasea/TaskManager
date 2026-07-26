export type TaskStatus = 'ToDo' | 'InProgress' | 'Done';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string | null;
  projectId: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string | null;
  projectId: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string | null;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}
