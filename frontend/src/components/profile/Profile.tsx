import React, { useState, useEffect, useRef } from 'react';
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
  IconButton,
  Chip,
} from '@mui/material';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  changePassword,
  uploadProfilePicture
} from '../../store/userSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';

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
  const { loading, error, message, user } = useSelector((state: RootState) => state.user);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    dispatch(fetchUserProfile())
      .unwrap()
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, [dispatch]);
  
  const handleProfileUpdate = async (values: any) => {
    await dispatch(updateUserProfile(values))
      .unwrap()
      .catch((error) => {
        console.error('Error updating profile:', error);
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

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await dispatch(uploadProfilePicture(file)).unwrap();
        // Force refresh profile after upload
        dispatch(fetchUserProfile());
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };
  
  if (loading && !user) {
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, mb: 3 }}>
            <Box sx={{ position: 'relative', mb: { xs: 2, sm: 0 }, mr: { sm: 3 } }}>
              <Avatar
                src={user?.profilePicture}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  border: '4px solid #fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  objectFit: 'cover'
                }}
                imgProps={{
                  style: {
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  bgcolor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.dark' },
                  color: 'white'
                }}
                onClick={handleProfilePictureClick}
              >
                <PhotoCameraIcon />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </Box>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user?.name}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Username: {user?.username}
              </Typography>
              {authUser?.roles?.includes('ROLE_ADMIN') && (
                <Chip 
                  label="Admin" 
                  color="secondary" 
                  size="small" 
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Personal Information
            </Typography>
            <EditIcon color="primary" fontSize="small" />
          </Box>
          
          {user && (
            <Formik
              initialValues={{
                name: user.name || '',
                email: user.email || '',
              }}
              validationSchema={ProfileSchema}
              onSubmit={handleProfileUpdate}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                    <Box sx={{ width: '100%' }}>
                      <Field name="name">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            label="Name"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            variant="outlined"
                          />
                        )}
                      </Field>
                    </Box>
                    
                    <Box sx={{ width: '100%' }}>
                      <Field name="email">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            label="Email"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            variant="outlined"
                          />
                        )}
                      </Field>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Security
            </Typography>
            <EditIcon color="primary" fontSize="small" />
          </Box>
          
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
                <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                  <Box sx={{ width: '100%' }}>
                    <Field name="currentPassword">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          type="password"
                          label="Current Password"
                          fullWidth
                          error={meta.touched && Boolean(meta.error)}
                          helperText={meta.touched && meta.error}
                          variant="outlined"
                        />
                      )}
                    </Field>
                  </Box>
                  
                  <Box sx={{ width: '100%' }}>
                    <Field name="newPassword">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          type="password"
                          label="New Password"
                          fullWidth
                          error={meta.touched && Boolean(meta.error)}
                          helperText={meta.touched && meta.error}
                          variant="outlined"
                        />
                      )}
                    </Field>
                  </Box>
                  
                  <Box sx={{ width: '100%' }}>
                    <Field name="confirmPassword">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          type="password"
                          label="Confirm New Password"
                          fullWidth
                          error={meta.touched && Boolean(meta.error)}
                          helperText={meta.touched && meta.error}
                          variant="outlined"
                        />
                      )}
                    </Field>
                  </Box>
                </Stack>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Profile;



