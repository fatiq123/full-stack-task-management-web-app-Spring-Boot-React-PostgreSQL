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

// Task Filter Types
export interface TaskFilterDto {
  searchTerm?: string;
  priority?: Priority;
  categoryId?: number;
  completed?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Task Reminder Types
export interface TaskReminderDto {
  taskId: number;
  taskTitle?: string;
  dueDate?: string;
  reminderType: 'EMAIL' | 'NOTIFICATION';
  reminderTime: string;
  sent?: boolean;
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
  // Enhanced dashboard data
  tasksByCategory?: Record<string, number>;
  tasksByPriority?: Record<string, number>;
  tasksByMonth?: Record<string, number>;
  recentTasks?: TaskDto[];
  upcomingDeadlines?: TaskDto[];
  completionRate?: number;
  taskCompletionTrend?: Record<string, number>;
  averageCompletionTimeInDays?: number;
}
