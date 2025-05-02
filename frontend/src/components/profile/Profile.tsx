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
} from '@mui/material';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { fetchUserProfile, updateUserProfile, changePassword } from '../../store/userSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';

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

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, message } = useSelector((state: RootState) => state.user);
  const [userData, setUserData] = useState<any>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(fetchUserProfile())
      .unwrap()
      .then((userData) => {
        setUserData(userData);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, [dispatch]);
  
  const handleProfileUpdate = async (values: any) => {
    await dispatch(updateUserProfile(values))
      .unwrap()
      .then((updatedUser) => {
        setUserData(updatedUser);
      });
  };
  
  const handlePasswordChange = async (values: any, { resetForm }: any) => {
    try {
      await dispatch(changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })).unwrap();
      setPasswordSuccess('Password changed successfully');
      setPasswordError(null);
      resetForm();
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
      setPasswordSuccess(null);
    }
  };
  
  if (loading && !userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}
            >
              {userData?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5">{userData?.name}</Typography>
              <Typography variant="body1" color="text.secondary">
                {userData?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Username: {userData?.username}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Update Profile
          </Typography>
          
          {userData && (
            <Formik
              initialValues={{
                name: userData.name || '',
                email: userData.email || '',
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
          )}
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {passwordSuccess}
            </Alert>
          )}
          
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Profile;

