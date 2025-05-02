import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchDashboardData } from '../../store/dashboardSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { Priority } from '../../types';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);
  
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
  
  const chartData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [data?.completedTasks || 0, data?.pendingTasks || 0, data?.overdueTasks || 0],
        backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
        borderColor: ['#388e3c', '#1976d2', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
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
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Stack spacing={3}>
        {/* Task Statistics */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Paper sx={{ p: 3, height: '100%', flex: { md: 2 } }}>
            <Typography variant="h6" gutterBottom>
              Task Statistics
            </Typography>
            <Stack 
              direction="row" 
              spacing={2} 
              flexWrap="wrap" 
              useFlexGap 
              sx={{ mb: 4 }}
            >
              <Card sx={{ 
                bgcolor: 'primary.light', 
                color: 'primary.contrastText',
                flex: '1 1 calc(25% - 16px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' }
              }}>
                <CardContent>
                  <Typography variant="h5">{data?.totalTasks || 0}</Typography>
                  <Typography variant="body2">Total Tasks</Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                bgcolor: 'success.light', 
                color: 'success.contrastText',
                flex: '1 1 calc(25% - 16px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' }
              }}>
                <CardContent>
                  <Typography variant="h5">{data?.completedTasks || 0}</Typography>
                  <Typography variant="body2">Completed</Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                bgcolor: 'info.light', 
                color: 'info.contrastText',
                flex: '1 1 calc(25% - 16px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' }
              }}>
                <CardContent>
                  <Typography variant="h5">{data?.pendingTasks || 0}</Typography>
                  <Typography variant="body2">Pending</Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                bgcolor: 'error.light', 
                color: 'error.contrastText',
                flex: '1 1 calc(25% - 16px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' }
              }}>
                <CardContent>
                  <Typography variant="h5">{data?.overdueTasks || 0}</Typography>
                  <Typography variant="body2">Overdue</Typography>
                </CardContent>
              </Card>
            </Stack>
            
            <Box sx={{ height: 300 }}>
              <Doughnut data={chartData} options={chartOptions} />
            </Box>
          </Paper>
          
          {/* Categories */}
          <Paper sx={{ p: 3, height: '100%', flex: { md: 1 } }}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            {data?.categories && data.categories.length > 0 ? (
              <List>
                {data.categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <ListItem>
                      <ListItemIcon>
                        <CategoryIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={category.name} 
                        secondary={category.description || 'No description'} 
                      />
                      <Chip 
                        label={`${category.taskCount} tasks`} 
                        size="small" 
                        color="primary" 
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No categories found. Create some categories to organize your tasks.
              </Typography>
            )}
          </Paper>
        </Stack>
        
        {/* Upcoming Tasks */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Tasks
          </Typography>
          {data?.upcomingTasks && data.upcomingTasks.length > 0 ? (
            <List>
              {data.upcomingTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <ListItem>
                    <ListItemIcon>
                      {task.completed ? (
                        <CheckCircleIcon color="success" />
                      ) : new Date(task.dueDate) < new Date() ? (
                        <WarningIcon color="error" />
                      ) : (
                        <PendingIcon color="info" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            Due: {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                          {task.description && (
                            <Typography component="span" variant="body2" display="block">
                              {task.description.length > 60
                                ? `${task.description.substring(0, 60)}...`
                                : task.description}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <Box>
                      <Chip
                        label={task.priority}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {task.categoryName && (
                        <Chip
                          icon={<CategoryIcon />}
                          label={task.categoryName}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <AssignmentIcon color="disabled" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No upcoming tasks. You're all caught up!
              </Typography>
            </Box>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};

export default Dashboard;
