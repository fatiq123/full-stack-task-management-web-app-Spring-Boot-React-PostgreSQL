import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import { TaskDto, TaskReminderDto } from '../types';
import { format } from 'date-fns';
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
  onReminderDeleted 
}) => {
  const [open, setOpen] = useState(false);
  const [reminderType, setReminderType] = useState<'EMAIL' | 'NOTIFICATION'>('EMAIL');
  const [reminderTime, setReminderTime] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!reminderTime) return;
    
    setLoading(true);
    try {
      const reminderDto: TaskReminderDto = {
        taskId: task.id!,
        reminderType,
        reminderTime: reminderTime.toISOString()
      };
      
      await reminderApi.createReminder(reminderDto);
      onReminderAdded();
      handleClose();
    } catch (error) {
      console.error('Error creating reminder:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (id: number) => {
    try {
      await reminderApi.deleteReminder(id);
      onReminderDeleted();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  return (
    <Box mt={3}>
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Task Reminders
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpen}
            startIcon={<NotificationsIcon />}
          >
            Add Reminder
          </Button>
        </Box>

        {reminders.length > 0 ? (
          <List>
            {reminders.map((reminder, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDeleteReminder(reminder.taskId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        {reminder.reminderType === 'EMAIL' ? 
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
                        {reminder.sent && ' (Sent)'}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" py={2}>
            No reminders set for this task
          </Typography>
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set Reminder for {task.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reminder Type</InputLabel>
              <Select
                value={reminderType}
                onChange={(e) => setReminderType(e.target.value as 'EMAIL' | 'NOTIFICATION')}
                label="Reminder Type"
              >
                <MenuItem value="EMAIL">Email</MenuItem>
                <MenuItem value="NOTIFICATION">Notification</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Reminder Time"
                value={reminderTime}
                onChange={(newValue) => setReminderTime(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading || !reminderTime}
          >
            Set Reminder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskReminder;
