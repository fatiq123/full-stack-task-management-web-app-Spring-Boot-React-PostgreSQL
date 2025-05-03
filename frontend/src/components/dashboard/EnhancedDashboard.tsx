import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchDashboardData } from '../../store/dashboardSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import EnhancedDashboardView from '../EnhancedDashboard';

const EnhancedDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

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
          Enhanced Dashboard
        </Typography>

        {data && <EnhancedDashboardView dashboardData={data} />}
      </Box>
  );
};

export default EnhancedDashboard;