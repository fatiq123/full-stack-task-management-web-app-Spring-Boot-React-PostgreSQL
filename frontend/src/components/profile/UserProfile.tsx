import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { fetchUserProfile, updateUserProfile, changePassword } from '../../store/profileSlice';
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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

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
  
  const handleProfileUpdate = async (values: any) => {
    await dispatch(updateUserProfile(values));
  };
  
  const handlePasswordChange = async (values: any, { resetForm }: any) => {
    await dispatch(changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    }));
    resetForm();
  };
  
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
      
      <Paper sx={{ p: 3 }}>
        {profile && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}
              >
                {profile.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h5">{profile.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {profile.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Username: {profile.username}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
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
              <Formik
                initialValues={{
                  name: profile.name || '',
                  email: profile.email || '',
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleProfileUpdate}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Stack spacing={2}>
                      <Field name="name">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            label="Name"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                      
                      <Field name="email">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            label="Email"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting || loading}
                        >
                          {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Box>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={PasswordSchema}
                onSubmit={handlePasswordChange}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Stack spacing={2}>
                      <Field name="currentPassword">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            type="password"
                            label="Current Password"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                      
                      <Field name="newPassword">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            type="password"
                            label="New Password"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                      
                      <Field name="confirmPassword">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            type="password"
                            label="Confirm New Password"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting || loading}
                        >
                          {isSubmitting || loading ? 'Changing...' : 'Change Password'}
                        </Button>
                      </Box>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </TabPanel>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UserProfile;
