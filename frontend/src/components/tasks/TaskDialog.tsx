import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createTask, updateTask } from '../../store/taskSlice';
import { fetchAllCategories } from '../../store/categorySlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { TaskDto, Priority } from '../../types';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: TaskDto | null;
  onSave: () => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, task, onSave }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.tasks);
  const { categories } = useSelector((state: RootState) => state.categories);
  
  // Use local state instead of formik for better control
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState<Date>(task?.dueDate ? new Date(task.dueDate) : new Date());
  const [priority, setPriority] = useState<Priority>(task?.priority || Priority.MEDIUM);
  const [categoryId, setCategoryId] = useState<string>(task?.categoryId !== undefined ? String(task.categoryId) : '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Reset form when task changes or dialog opens/closes
  React.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(new Date(task.dueDate));
      setPriority(task.priority);
      setCategoryId(task.categoryId !== undefined ? String(task.categoryId) : '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setPriority(Priority.MEDIUM);
      setCategoryId('');
    }
    setErrors({});
  }, [task, open]);
  
  // Load categories when component mounts
  React.useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);
  
  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      // Convert categoryId from string to number or undefined
      const categoryIdNum = categoryId ? Number(categoryId) : undefined;
      
      if (task?.id) {
        await dispatch(updateTask({ 
          id: task.id, 
          task: { 
            title,
            description,
            priority,
            dueDate: dueDate.toISOString(),
            completed: task.completed || false,
            categoryId: categoryIdNum
          } 
        })).unwrap();
      } else {
        await dispatch(createTask({ 
          title,
          description,
          priority,
          dueDate: dueDate.toISOString(),
          completed: false,
          categoryId: categoryIdNum
        })).unwrap();
      }
      onSave();
    } catch (error) {
      // Error is handled by the reducer
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              autoComplete="off"
            />
            
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
            />
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(value) => {
                    if (value) setDueDate(value);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dueDate,
                      helperText: errors.dueDate,
                    },
                  }}
                />
              </LocalizationProvider>
              
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  label="Priority"
                >
                  <MenuItem value={Priority.LOW}>Low</MenuItem>
                  <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={Priority.HIGH}>High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="categoryId"
                name="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} type="button">Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskDialog;
