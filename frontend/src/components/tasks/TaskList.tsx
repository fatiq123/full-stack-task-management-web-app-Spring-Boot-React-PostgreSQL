import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  ListItemButton,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Category as CategoryIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  fetchAllTasks, 
  fetchCompletedTasks, 
  fetchPendingTasks, 
  fetchOverdueTasks,
  toggleTaskCompletion,
  deleteTask
} from '../../store/taskSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { TaskDto, Priority } from '../../types';
import TaskDialog from './TaskDialog';
import ConfirmDialog from '../common/ConfirmDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  
  const [tabValue, setTabValue] = useState(0);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskDto | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  
  useEffect(() => {
    loadTasks();
  }, [tabValue, dispatch]);
  
  const loadTasks = () => {
    switch (tabValue) {
      case 0:
        dispatch(fetchAllTasks());
        break;
      case 1:
        dispatch(fetchPendingTasks());
        break;
      case 2:
        dispatch(fetchCompletedTasks());
        break;
      case 3:
        dispatch(fetchOverdueTasks());
        break;
      default:
        dispatch(fetchAllTasks());
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, taskId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };
  
  const handleAddTask = () => {
    setCurrentTask(null);
    setOpenTaskDialog(true);
  };
  
  const handleEditTask = (task: TaskDto) => {
    setCurrentTask(task);
    setOpenTaskDialog(true);
    handleCloseMenu();
  };
  
  const handleTaskDialogClose = () => {
    setOpenTaskDialog(false);
    setCurrentTask(null);
  };
  
  const handleTaskSaved = () => {
    setOpenTaskDialog(false);
    setCurrentTask(null);
    loadTasks();
  };
  
  const handleToggleCompletion = (taskId: number) => {
    dispatch(toggleTaskCompletion(taskId))
      .unwrap()
      .then(() => {
        loadTasks();
      })
      .catch((error) => {
        console.error('Failed to toggle task completion:', error);
      });
  };
  
  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
    handleCloseMenu();
  };
  
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete))
        .unwrap()
        .then(() => {
          loadTasks();
        });
    }
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
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
  
  const isOverdue = (dueDate: string, completed: boolean) => {
    return !completed && new Date(dueDate) < new Date();
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Tasks" />
          <Tab label="Pending" />
          <Tab label="Completed" />
          <Tab label="Overdue" />
        </Tabs>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              <TaskListContent 
                tasks={tasks} 
                handleToggleCompletion={handleToggleCompletion}
                handleOpenMenu={handleOpenMenu}
                getPriorityColor={getPriorityColor}
                isOverdue={isOverdue}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <TaskListContent 
                tasks={tasks} 
                handleToggleCompletion={handleToggleCompletion}
                handleOpenMenu={handleOpenMenu}
                getPriorityColor={getPriorityColor}
                isOverdue={isOverdue}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <TaskListContent 
                tasks={tasks} 
                handleToggleCompletion={handleToggleCompletion}
                handleOpenMenu={handleOpenMenu}
                getPriorityColor={getPriorityColor}
                isOverdue={isOverdue}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <TaskListContent 
                tasks={tasks} 
                handleToggleCompletion={handleToggleCompletion}
                handleOpenMenu={handleOpenMenu}
                getPriorityColor={getPriorityColor}
                isOverdue={isOverdue}
              />
            </TabPanel>
          </>
        )}
      </Paper>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem 
          onClick={() => {
            const task = tasks.find(t => t.id === selectedTaskId);
            if (task) handleEditTask(task);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedTaskId && handleDeleteClick(selectedTaskId)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      
      <TaskDialog
        open={openTaskDialog}
        onClose={handleTaskDialogClose}
        task={currentTask}
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

interface TaskListContentProps {
  tasks: TaskDto[];
  handleToggleCompletion: (taskId: number) => void;
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>, taskId: number) => void;
  getPriorityColor: (priority: Priority) => "error" | "warning" | "success" | "default";
  isOverdue: (dueDate: string, completed: boolean) => boolean;
}

const TaskListContent: React.FC<TaskListContentProps> = ({
  tasks,
  handleToggleCompletion,
  handleOpenMenu,
  getPriorityColor,
  isOverdue
}) => {
  if (tasks.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No tasks found. Create a new task to get started.
        </Typography>
      </Box>
    );
  }
  
  return (
    <List>
      {tasks.map((task) => (
        <React.Fragment key={task.id}>
          <ListItem
            disablePadding
            sx={{
              bgcolor: isOverdue(task.dueDate, task.completed) ? 'error.50' : 'inherit',
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <IconButton
                  edge="start"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.id !== undefined) handleToggleCompletion(task.id);
                  }}
                >
                  {task.completed ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'text.secondary' : 'text.primary',
                    }}
                  >
                    {task.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Due: {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}
                      {isOverdue(task.dueDate, task.completed) && (
                        <Chip
                          label="Overdue"
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </Box>
                }
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={task.priority}
                  color={getPriorityColor(task.priority)}
                  size="small"
                />
                {task.categoryName && (
                  <Chip
                    icon={<CategoryIcon />}
                    label={task.categoryName}
                    size="small"
                    variant="outlined"
                  />
                )}
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.id) handleOpenMenu(e, task.id);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </ListItemButton>
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
};

export default TaskList;
