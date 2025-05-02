import axios from 'axios';
import { 
  LoginRequest, 
  SignupRequest, 
  JwtResponse, 
  UserDto, 
  PasswordChangeRequest,
  TaskDto,
  CategoryDto,
  DashboardDto
} from '../types';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for CORS with credentials
});

// Add a request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add error handling interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  login: (loginRequest: LoginRequest) => 
    api.post<JwtResponse>('/auth/signin', loginRequest),
  
  register: (signupRequest: SignupRequest) => 
    api.post<{ message: string }>('/auth/signup', signupRequest),
};

// User API
export const userApi = {
  getProfile: () => 
    api.get<UserDto>('/users/profile'),
  
  updateProfile: (userDto: UserDto) => 
    api.put<UserDto>('/users/profile', userDto),
  
  changePassword: (passwordData: PasswordChangeRequest) => 
    api.post<{ message: string }>('/users/change-password', passwordData),
};

// Task API
export const taskApi = {
  getAllTasks: () => 
    api.get<TaskDto[]>('/tasks'),
  
  getTasksByPriority: () => 
    api.get<TaskDto[]>('/tasks/priority'),
  
  getCompletedTasks: () => 
    api.get<TaskDto[]>('/tasks/completed'),
  
  getPendingTasks: () => 
    api.get<TaskDto[]>('/tasks/pending'),
  
  getOverdueTasks: () => 
    api.get<TaskDto[]>('/tasks/overdue'),
  
  getTaskById: (id: number) => 
    api.get<TaskDto>(`/tasks/${id}`),
  
  createTask: (task: TaskDto) => 
    api.post<TaskDto>('/tasks', task),
  
  updateTask: (id: number, task: TaskDto) => 
    api.put<TaskDto>(`/tasks/${id}`, task),
  
  deleteTask: (id: number) => 
    api.delete(`/tasks/${id}`),
  
  toggleTaskCompletion: (id: number) => 
    api.patch<TaskDto>(`/tasks/${id}/toggle-completion`),
};

// Category API
export const categoryApi = {
  getAllCategories: () => 
    api.get<CategoryDto[]>('/categories'),
  
  getCategoryById: (id: number) => 
    api.get<CategoryDto>(`/categories/${id}`),
  
  createCategory: (category: CategoryDto) => 
    api.post<CategoryDto>('/categories', category),
  
  updateCategory: (id: number, category: CategoryDto) => 
    api.put<CategoryDto>(`/categories/${id}`, category),
  
  deleteCategory: (id: number) => 
    api.delete(`/categories/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getDashboardData: () => 
    api.get<DashboardDto>('/dashboard'),
};

export default api;
