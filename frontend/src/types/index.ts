// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  roles?: string[];
}

export interface JwtResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  name: string;
  roles: string[];
}

export interface MessageResponse {
  message: string;
}

// User Types
export interface UserDto {
  id: number;
  username: string;
  email: string;
  name: string;
  profilePicture?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// Task Types
export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}

export interface TaskDto {
  id?: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  categoryId?: number;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Category Types
export interface CategoryDto {
  id?: number;
  name: string;
  description?: string;
  taskCount?: number;
}

// Dashboard Types
export interface DashboardDto {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  upcomingTasks: TaskDto[];
  categories: CategoryDto[];
}
