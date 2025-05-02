import axios from 'axios';
import { 
  LoginRequest, 
  SignupRequest, 
  TaskDto, 
  CategoryDto, 
  UserDto, 
  PasswordChangeRequest,
  TaskFilterDto,
  TaskReminderDto
} from '../types';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
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

// Handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (loginRequest: LoginRequest) => {
    return axiosInstance.post('/auth/signin', loginRequest);
  },
  register: (signupRequest: SignupRequest) => {
    return axiosInstance.post('/auth/signup', signupRequest);
  },
};

// User API
export const userApi = {
  getProfile: () => {
    return axiosInstance.get('/users/profile');
  },
  updateProfile: (userDto: UserDto) => {
    return axiosInstance.put('/users/profile', userDto);
  },
  changePassword: (passwordData: PasswordChangeRequest) => {
    return axiosInstance.post('/users/change-password', passwordData);
  },
};

// Task API
export const taskApi = {
  getAllTasks: () => {
    return axiosInstance.get('/tasks');
  },
  getTaskById: (id: number) => {
    return axiosInstance.get(`/tasks/${id}`);
  },
  createTask: (task: TaskDto) => {
    return axiosInstance.post('/tasks', task);
  },
  updateTask: (id: number, task: TaskDto) => {
    return axiosInstance.put(`/tasks/${id}`, task);
  },
  deleteTask: (id: number) => {
    return axiosInstance.delete(`/tasks/${id}`);
  },
  getCompletedTasks: () => {
    return axiosInstance.get('/tasks/completed');
  },
  getPendingTasks: () => {
    return axiosInstance.get('/tasks/pending');
  },
  getOverdueTasks: () => {
    return axiosInstance.get('/tasks/overdue');
  },
  toggleTaskCompletion: (id: number) => {
    return axiosInstance.patch(`/tasks/${id}/toggle-completion`);
  },
  filterTasks: (filter: TaskFilterDto, page: number = 0, size: number = 10) => {
    return axiosInstance.post(`/tasks/filter?page=${page}&size=${size}`, filter);
  },
  getUpcomingTasks: (days: number = 7) => {
    return axiosInstance.get(`/tasks/upcoming?days=${days}`);
  },
};

// Category API
export const categoryApi = {
  getAllCategories: () => {
    return axiosInstance.get('/categories');
  },
  getCategoryById: (id: number) => {
    return axiosInstance.get(`/categories/${id}`);
  },
  createCategory: (category: CategoryDto) => {
    return axiosInstance.post('/categories', category);
  },
  updateCategory: (id: number, category: CategoryDto) => {
    return axiosInstance.put(`/categories/${id}`, category);
  },
  deleteCategory: (id: number) => {
    return axiosInstance.delete(`/categories/${id}`);
  },
};

// Dashboard API
export const dashboardApi = {
  getDashboardData: () => {
    return axiosInstance.get('/dashboard');
  },
};

// Reminder API
export const reminderApi = {
  getUserReminders: () => {
    return axiosInstance.get('/reminders');
  },
  getRemindersByTaskId: (taskId: number) => {
    return axiosInstance.get(`/reminders/task/${taskId}`);
  },
  createReminder: (reminder: TaskReminderDto) => {
    return axiosInstance.post('/reminders', reminder);
  },
  updateReminder: (id: number, reminder: TaskReminderDto) => {
    return axiosInstance.put(`/reminders/${id}`, reminder);
  },
  deleteReminder: (id: number) => {
    return axiosInstance.delete(`/reminders/${id}`);
  },
};
