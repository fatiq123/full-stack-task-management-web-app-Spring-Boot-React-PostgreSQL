// Auth Types
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
  id: number;
  username: string;
  email: string;
  name: string;
  roles: string[];
  token: string;
}

// User Types
export interface UserDto {
  id?: number;
  username?: string;
  email?: string;
  name?: string;
  profilePicture?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// Task Types
export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface TaskDto {
  id?: number;
  title: string;
  description?: string;
  dueDate: string;
  completed?: boolean;
  priority: Priority;
  categoryId?: number;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
  completionRate: number;
  averageCompletionTimeInDays: number;
  tasksByPriority: Record<string, number>;
  tasksByCategory: Record<string, number>;
  tasksByMonth: Record<string, number>;
  taskCompletionTrend: Record<string, number>;
  recentTasks: TaskDto[];
  upcomingDeadlines: TaskDto[];
  categories: CategoryDto[];
  upcomingTasks: TaskDto[];
}

// Reminder Types
export enum ReminderType {
  EMAIL = 'EMAIL',
  NOTIFICATION = 'NOTIFICATION'
}

export interface TaskReminderDto {
  id?: number;
  taskId: number;
  taskTitle?: string;
  reminderTime: string;
  reminderType: ReminderType;
  reminderSent: boolean;
  createdAt?: string;
}

// Pagination Types
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}
