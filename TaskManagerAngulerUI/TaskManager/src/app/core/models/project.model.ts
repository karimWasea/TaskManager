import { TaskItem } from './task.model';

export interface ApiResult<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  taskCount?: number;
}

export interface ProjectDetail extends Project {
  tasks: TaskItem[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name: string;
  description: string;
}
