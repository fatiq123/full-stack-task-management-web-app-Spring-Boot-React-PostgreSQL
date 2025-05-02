import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { createTask, updateTask } from '../../store/taskSlice';
import { fetchAllCategories } from '../../store/categorySlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { TaskDto, Priority } from '../../types';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: TaskDto | null;
  onSave: () => void;
}

const TaskSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  dueDate: Yup.date().required('Due date is required'),
  priority: Yup.string().required('Priority is required'),
  categoryId: Yup.number().nullable(),
});

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, task, onSave }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { loading } = useSelector((state: RootState) => state.tasks);
  
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);
  
  const initialValues: TaskDto = {
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || new Date().toISOString(),
    priority: task?.priority || Priority.MEDIUM,
    completed: task?.completed || false,
    categoryId: task?.categoryId || undefined,
  };
  
  const handleSubmit = async (values: TaskDto) => {
    try {
      if (task?.id) {
        await dispatch(updateTask({ id: task.id, task: values })).unwrap();
      } else {
        await dispatch(createTask(values)).unwrap();
      }
      onSave();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={TaskSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Field name="title">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Title"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
                
                <Field name="description">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Due Date"
                    value={new Date(values.dueDate)}
                    onChange={(date) => {
                      if (date) {
                        setFieldValue('dueDate', date.toISOString());
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: touched.dueDate && Boolean(errors.dueDate),
                        helperText: touched.dueDate && errors.dueDate,
                      },
                    }}
                  />
                </LocalizationProvider>
                
                <Field name="priority">
                  {({ field, meta }: FieldProps) => (
                    <FormControl 
                      fullWidth 
                      error={meta.touched && Boolean(meta.error)}
                    >
                      <InputLabel>Priority</InputLabel>
                      <Select
                        {...field}
                        label="Priority"
                      >
                        <MenuItem value={Priority.HIGH}>High</MenuItem>
                        <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
                        <MenuItem value={Priority.LOW}>Low</MenuItem>
                      </Select>
                      {meta.touched && meta.error && (
                        <FormHelperText>{meta.error}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                </Field>
                
                <Field name="categoryId">
                  {({ field, meta }: FieldProps) => (
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        {...field}
                        label="Category"
                        displayEmpty
                        value={field.value || ''}
                      >
                        <MenuItem value="">No Category</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Field>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting || loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {task ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default TaskDialog;
