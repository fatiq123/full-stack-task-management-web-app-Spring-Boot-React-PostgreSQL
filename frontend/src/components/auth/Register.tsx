import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { PersonAddOutlined as PersonAddOutlinedIcon } from '@mui/icons-material';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { register } from '../../store/authSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  name: Yup.string().required('Name is required'),
  isAdmin: Yup.boolean(),
});

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (values: { username: string; email: string; password: string; name: string; isAdmin: boolean }) => {
    try {
      const roles = values.isAdmin ? ['admin'] : undefined;
      await dispatch(register({
        username: values.username,
        email: values.email,
        password: values.password,
        name: values.name,
        roles: roles ? roles : undefined
      })).unwrap();
      
      // Registration successful
      setRegistrationSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
            <PersonAddOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Create Account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          {registrationSuccess && (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              {registrationSuccess}
            </Alert>
          )}
          
          <Formik
            initialValues={{ username: '', email: '', password: '', name: '', isAdmin: false }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, values, handleChange }) => (
              <Form style={{ width: '100%', marginTop: '1rem' }}>
                <Field name="name">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      label="Full Name"
                      autoFocus
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      variant="outlined"
                    />
                  )}
                </Field>
                
                <Field name="username">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      label="Username"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      variant="outlined"
                    />
                  )}
                </Field>
                
                <Field name="email">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      label="Email Address"
                      type="email"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      variant="outlined"
                    />
                  )}
                </Field>
                
                <Field name="password">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      label="Password"
                      type="password"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      variant="outlined"
                    />
                  )}
                </Field>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isAdmin}
                      onChange={handleChange}
                      name="isAdmin"
                      color="primary"
                    />
                  }
                  label="Register as Admin"
                  sx={{ mt: 1, mb: 1 }}
                />
                {touched.isAdmin && errors.isAdmin && (
                  <FormHelperText error>{errors.isAdmin}</FormHelperText>
                )}
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
                  disabled={isSubmitting || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'primary.main' }}>
                    {"Already have an account? Sign In"}
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;

