import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskApi } from '../services/api';
import { TaskDto } from '../types';

interface TaskState {
  tasks: TaskDto[];
  currentTask: TaskDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskApi.getAllTasks();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTasksByPriority = createAsyncThunk(
  'tasks/fetchByPriority',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskApi.getTasksByPriority();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks by priority');
    }
  }
);

export const fetchCompletedTasks = createAsyncThunk(
  'tasks/fetchCompleted',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskApi.getCompletedTasks();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed tasks');
    }
  }
);

export const fetchPendingTasks = createAsyncThunk(
  'tasks/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskApi.getPendingTasks();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending tasks');
    }
  }
);

export const fetchOverdueTasks = createAsyncThunk(
  'tasks/fetchOverdue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskApi.getOverdueTasks();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch overdue tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await taskApi.getTaskById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (task: TaskDto, { rejectWithValue }) => {
    try {
      const response = await taskApi.createTask(task);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, task }: { id: number; task: TaskDto }, { rejectWithValue }) => {
    try {
      const response = await taskApi.updateTask(id, task);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const toggleTaskCompletion = createAsyncThunk(
  'tasks/toggleCompletion',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await taskApi.toggleTaskCompletion(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle task completion');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action: PayloadAction<TaskDto[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch tasks by priority
      .addCase(fetchTasksByPriority.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByPriority.fulfilled, (state, action: PayloadAction<TaskDto[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByPriority.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch completed tasks
      .addCase(fetchCompletedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action: PayloadAction<TaskDto[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchCompletedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch pending tasks
      .addCase(fetchPendingTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingTasks.fulfilled, (state, action: PayloadAction<TaskDto[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchPendingTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch overdue tasks
      .addCase(fetchOverdueTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverdueTasks.fulfilled, (state, action: PayloadAction<TaskDto[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchOverdueTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<TaskDto>) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<TaskDto>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<TaskDto>) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.currentTask = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Toggle task completion
      .addCase(toggleTaskCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action: PayloadAction<TaskDto>) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(toggleTaskCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentTask, clearError } = taskSlice.actions;
export default taskSlice.reducer;
