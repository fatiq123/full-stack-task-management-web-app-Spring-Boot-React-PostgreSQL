import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { TaskDto, TaskReminderDto, ReminderType } from '../types';
import { reminderApi } from '../services/api';

interface TaskReminderProps {
  task: TaskDto;
  reminders: TaskReminderDto[];
  onReminderAdded: () => void;
  onReminderDeleted: () => void;
}

const TaskReminder: React.FC<TaskReminderProps> = ({
  task,
  reminders,
  onReminderAdded,
  onReminderDeleted,
}) => {
  const [open, setOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date | null>(new Date());
  const [reminderType, setReminderType] = useState<ReminderType>(ReminderType.EMAIL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
    setReminderTime(new Date());
    setReminderType(ReminderType.EMAIL);
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddReminder = async () => {
    if (!reminderTime) {
      setError('Please select a reminder time');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const reminderDto: TaskReminderDto = {
        taskId: task.id!,
        reminderType,
        reminderTime: reminderTime.toISOString(),
        reminderSent: false
      };
      
      await reminderApi.createReminder(reminderDto);
      setSuccess('Reminder added successfully');
      onReminderAdded();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (id: number) => {
    setLoading(true);
    try {
      await reminderApi.deleteReminder(id);
      onReminderDeleted();
    } catch (err: any) {
      console.error('Failed to delete reminder:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Reminders</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          disabled={loading}
        >
          Add Reminder
        </Button>
      </Box>

      {reminders.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No reminders set for this task.
        </Typography>
      ) : (
        <List>
          {reminders.map((reminder) => (
            <React.Fragment key={reminder.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => reminder.id && handleDeleteReminder(reminder.id)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      {reminder.reminderType === ReminderType.EMAIL ? 
                        <EmailIcon color="primary" sx={{ mr: 1 }} /> : 
                        <NotificationsIcon color="secondary" sx={{ mr: 1 }} />
                      }
                      <Typography variant="body1">
                        {reminder.reminderType} Reminder
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {reminder.reminderTime && format(new Date(reminder.reminderTime), 'PPpp')}
                      {reminder.reminderSent && ' (Sent)'}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Reminder</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: '300px' }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Reminder Time"
                value={reminderTime}
                onChange={(newValue) => setReminderTime(newValue)}
                disablePast
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            
            <FormControl fullWidth>
              <InputLabel>Reminder Type</InputLabel>
              <Select
                value={reminderType}
                label="Reminder Type"
                onChange={(e) => setReminderType(e.target.value as ReminderType)}
              >
                <MenuItem value={ReminderType.EMAIL}>Email</MenuItem>
                <MenuItem value={ReminderType.NOTIFICATION}>Notification</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleAddReminder} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Adding...' : 'Add Reminder'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskReminder;
