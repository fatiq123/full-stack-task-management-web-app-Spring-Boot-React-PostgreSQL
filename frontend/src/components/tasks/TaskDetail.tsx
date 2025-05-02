import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fetchTaskById, toggleTaskCompletion, deleteTask } from '../../store/taskSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { Priority, TaskReminderDto } from '../../types';
import TaskDialog from './TaskDialog';
import ConfirmDialog from '../common/ConfirmDialog';
import TaskReminder from '../TaskReminder';
import { reminderApi } from '../../services/api';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = id ? parseInt(id) : undefined;
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedTask, loading, error } = useSelector((state: RootState) => state.tasks);
  
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reminders, setReminders] = useState<TaskReminderDto[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  
  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId));
      loadReminders(taskId);
    }
  }, [dispatch, taskId]);
  
  const loadReminders = async (taskId: number) => {
    setLoadingReminders(true);
    try {
      const response = await reminderApi.getUserReminders();
      const taskReminders = response.data.filter((reminder: TaskReminderDto) => reminder.taskId === taskId);
      setReminders(taskReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoadingReminders(false);
    }
  };
  
  const handleEditClick = () => {
    setOpenEditDialog(true);
  };
  
  const handleEditClose = () => {
    setOpenEditDialog(false);
  };
  
  const handleTaskSaved = () => {
    setOpenEditDialog(false);
    if (taskId) {
      dispatch(fetchTaskById(taskId));
    }
  };
  
  const handleToggleCompletion = () => {
    if (taskId) {
      dispatch(toggleTaskCompletion(taskId))
        .unwrap()
        .then(() => {
          dispatch(fetchTaskById(taskId));
        });
    }
  };
  
  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (taskId) {
      dispatch(deleteTask(taskId))
        .unwrap()
        .then(() => {
          navigate('/tasks');
        });
    }
    setDeleteConfirmOpen(false);
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
  };
  
  const handleReminderAdded = () => {
    if (taskId) {
      loadReminders(taskId);
    }
  };
  
  const handleReminderDeleted = () => {
    if (taskId) {
      loadReminders(taskId);
    }
  };
  
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return 'error';
      case Priority.MEDIUM:
        return 'warning';
      case Priority.LOW:
        return 'success';
      default:
        return 'default';
    }
  };
  
  const isOverdue = (dueDate: string, completed: boolean | undefined) => {
    return !completed && new Date(dueDate) < new Date();
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!selectedTask) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Task not found.
      </Alert>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {selectedTask.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip
                icon={<AccessTimeIcon />}
                label={`Due: ${format(new Date(selectedTask.dueDate), 'PPP p')}`}
                color={isOverdue(selectedTask.dueDate, selectedTask.completed) ? 'error' : 'default'}
              />
              <Chip
                label={selectedTask.priority}
                color={getPriorityColor(selectedTask.priority)}
              />
              {selectedTask.categoryName && (
                <Chip
                  icon={<CategoryIcon />}
                  label={selectedTask.categoryName}
                  variant="outlined"
                />
              )}
              <Chip
                icon={selectedTask.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                label={selectedTask.completed ? 'Completed' : 'Pending'}
                color={selectedTask.completed ? 'success' : 'default'}
              />
            </Stack>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={selectedTask.completed ? <RadioButtonUncheckedIcon /> : <CheckCircleIcon />}
              onClick={handleToggleCompletion}
            >
              {selectedTask.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Stack>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedTask.description || 'No description provided.'}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Created: {selectedTask.createdAt && format(new Date(selectedTask.createdAt), 'PPP p')}
          </Typography>
          {selectedTask.updatedAt && (
            <Typography variant="body2" color="text.secondary">
              Last updated: {format(new Date(selectedTask.updatedAt), 'PPP p')}
            </Typography>
          )}
        </Box>
        
        {/* Task Reminders */}
        {!loadingReminders && selectedTask && (
          <TaskReminder 
            task={selectedTask} 
            reminders={reminders}
            onReminderAdded={handleReminderAdded}
            onReminderDeleted={handleReminderDeleted}
          />
        )}
      </Paper>
      
      <TaskDialog
        open={openEditDialog}
        onClose={handleEditClose}
        task={selectedTask}
        onSave={handleTaskSaved}
      />
      
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Task"
        content="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default TaskDetail;
