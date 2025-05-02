import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { DashboardDto, Priority, TaskDto } from '../types';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface EnhancedDashboardProps {
  dashboardData: DashboardDto;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ dashboardData }) => {
  // Prepare data for charts
  const categoryChartData = {
    labels: dashboardData.tasksByCategory ? Object.keys(dashboardData.tasksByCategory) : [],
    datasets: [
      {
        label: 'Tasks by Category',
        data: dashboardData.tasksByCategory ? Object.values(dashboardData.tasksByCategory) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const priorityChartData = {
    labels: dashboardData.tasksByPriority ? Object.keys(dashboardData.tasksByPriority) : [],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: dashboardData.tasksByPriority ? Object.values(dashboardData.tasksByPriority) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',  // HIGH
          'rgba(255, 206, 86, 0.6)',  // MEDIUM
          'rgba(75, 192, 192, 0.6)',  // LOW
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: dashboardData.tasksByMonth ? Object.keys(dashboardData.tasksByMonth).map(month => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames[parseInt(month) - 1];
    }) : [],
    datasets: [
      {
        label: 'Tasks Created',
        data: dashboardData.tasksByMonth ? Object.values(dashboardData.tasksByMonth) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const completionTrendData = {
    labels: dashboardData.taskCompletionTrend ? Object.keys(dashboardData.taskCompletionTrend) : [],
    datasets: [
      {
        label: 'Tasks Completed',
        data: dashboardData.taskCompletionTrend ? Object.values(dashboardData.taskCompletionTrend) : [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
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

  return (
    <Box sx={{ flexGrow: 1, mt: 3 }}>
      <Grid container spacing={3}>
        {/* Completion Rate */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Completion Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardData.completionRate || 0} 
                    color="primary"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {`${Math.round(dashboardData.completionRate || 0)}%`}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {dashboardData.completedTasks} of {dashboardData.totalTasks} tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Completion Time */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Completion Time
              </Typography>
              <Typography variant="h3" align="center" sx={{ my: 2 }}>
                {dashboardData.averageCompletionTimeInDays || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                days on average to complete tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks by Category */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Category
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Pie data={categoryChartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        {/* Tasks by Priority */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Priority
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Pie data={priorityChartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Task Creation */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Task Creation
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={monthlyChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Task Completion Trend */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Completion Trend (Last 6 Months)
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={completionTrendData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Tasks
            </Typography>
            <List>
              {dashboardData.recentTasks && dashboardData.recentTasks.length > 0 ? (
                dashboardData.recentTasks.map((task: TaskDto, index: number) => (
                  <React.Fragment key={task.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {task.createdAt && format(new Date(task.createdAt), 'PPP')}
                            </Typography>
                            {" — "}
                            <Chip 
                              label={task.priority} 
                              size="small" 
                              color={getPriorityColor(task.priority)} 
                              sx={{ ml: 1 }}
                            />
                            {task.categoryName && (
                              <Chip 
                                label={task.categoryName} 
                                size="small" 
                                variant="outlined" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  No recent tasks
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            <List>
              {dashboardData.upcomingDeadlines && dashboardData.upcomingDeadlines.length > 0 ? (
                dashboardData.upcomingDeadlines.map((task: TaskDto, index: number) => (
                  <React.Fragment key={task.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              Due: {task.dueDate && format(new Date(task.dueDate), 'PPP')}
                            </Typography>
                            {" — "}
                            <Chip 
                              label={task.priority} 
                              size="small" 
                              color={getPriorityColor(task.priority)} 
                              sx={{ ml: 1 }}
                            />
                            {task.categoryName && (
                              <Chip 
                                label={task.categoryName} 
                                size="small" 
                                variant="outlined" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  No upcoming deadlines
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedDashboard;
