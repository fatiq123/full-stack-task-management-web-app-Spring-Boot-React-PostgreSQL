import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Stack
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { fetchUserProfile, updateProfile, updatePassword } from '../../store/profileSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error, success } = useSelector((state: RootState) => state.profile);
  
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const profileFormik = useFormik({
    initialValues: {
      name: profile?.name || '',
      email: profile?.email || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: (values) => {
      dispatch(updateProfile(values));
    },
  });
  
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: (values) => {
      dispatch(updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }));
      
      // Reset form after submission
      if (!error) {
        passwordFormik.resetForm();
      }
    },
  });
  
  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Paper sx={{ p: 3, textAlign: 'center', flex: { md: 1 } }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              bgcolor: 'primary.main',
              fontSize: '3rem',
            }}
          >
            {profile?.name?.charAt(0) || profile?.username?.charAt(0) || <PersonIcon fontSize="large" />}
          </Avatar>
          <Typography variant="h5" sx={{ mt: 2 }}>
            {profile?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            @{profile?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {profile?.email}
          </Typography>
        </Paper>
        
        <Paper sx={{ width: '100%', flex: { md: 2 } }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Edit Profile" />
            <Tab label="Change Password" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={profileFormik.handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Full Name"
                  value={profileFormik.values.name}
                  onChange={profileFormik.handleChange}
                  error={profileFormik.touched.name && Boolean(profileFormik.errors.name)}
                  helperText={profileFormik.touched.name && profileFormik.errors.name?.toString()}
                />
                
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={profileFormik.values.email}
                  onChange={profileFormik.handleChange}
                  error={profileFormik.touched.email && Boolean(profileFormik.errors.email)}
                  helperText={profileFormik.touched.email && profileFormik.errors.email?.toString()}
                />
                
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Stack>
            </form>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={passwordFormik.handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  id="currentPassword"
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                  helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                />
                
                <TextField
                  fullWidth
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                  helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                />
                
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                  helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                />
                
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
                    disabled={loading}
                  >
                    Change Password
                  </Button>
                </Box>
              </Stack>
            </form>
          </TabPanel>
        </Paper>
      </Stack>
    </Box>
  );
};

export default UserProfile;
