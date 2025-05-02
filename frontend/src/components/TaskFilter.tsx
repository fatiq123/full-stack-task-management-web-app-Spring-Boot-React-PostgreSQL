import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  Paper,
  IconButton,
  Collapse,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { TaskFilterDto, Priority, CategoryDto } from '../types';

interface TaskFilterProps {
  categories: CategoryDto[];
  onFilter: (filter: TaskFilterDto) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ categories, onFilter }) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<TaskFilterDto>({
    sortBy: 'dueDate',
    sortDirection: 'asc'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name as string]: value }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setFilter(prev => ({ ...prev, [name]: date.toISOString() }));
    } else {
      setFilter(prev => {
        const newFilter = { ...prev };
        delete newFilter[name as keyof TaskFilterDto];
        return newFilter;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filter);
  };

  const handleReset = () => {
    setFilter({
      sortBy: 'dueDate',
      sortDirection: 'asc'
    });
    onFilter({
      sortBy: 'dueDate',
      sortDirection: 'asc'
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="div">
          <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Task Filters
        </Typography>
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <FilterListIcon /> : <FilterListIcon />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Search Tasks"
                name="searchTerm"
                value={filter.searchTerm || ''}
                onChange={handleChange}
                placeholder="Search by title or description"
              />

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={filter.priority || ''}
                  onChange={handleChange}
                  label="Priority"
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  <MenuItem value={Priority.HIGH}>High</MenuItem>
                  <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={Priority.LOW}>Low</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={filter.categoryId || ''}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="completed"
                  value={filter.completed === undefined ? '' : filter.completed}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value={true}>Completed</MenuItem>
                  <MenuItem value={false}>Pending</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filter.startDate ? new Date(filter.startDate) : null}
                  onChange={(date) => handleDateChange('startDate', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={filter.endDate ? new Date(filter.endDate) : null}
                  onChange={(date) => handleDateChange('endDate', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  name="sortBy"
                  value={filter.sortBy || 'dueDate'}
                  onChange={handleChange}
                  label="Sort By"
                  startAdornment={<SortIcon sx={{ mr: 1 }} />}
                >
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="createdAt">Created Date</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Sort Direction</InputLabel>
                <Select
                  name="sortDirection"
                  value={filter.sortDirection || 'asc'}
                  onChange={handleChange}
                  label="Sort Direction"
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Apply Filters
              </Button>
            </Box>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default TaskFilter;

