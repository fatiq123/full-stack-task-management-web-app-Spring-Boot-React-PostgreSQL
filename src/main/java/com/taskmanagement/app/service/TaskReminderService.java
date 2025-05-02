package com.taskmanagement.app.service;

import com.taskmanagement.app.dto.TaskReminderDto;
import com.taskmanagement.app.exception.ResourceNotFoundException;
import com.taskmanagement.app.model.Task;
import com.taskmanagement.app.model.TaskReminder;
import com.taskmanagement.app.model.User;
import com.taskmanagement.app.repository.TaskReminderRepository;
import com.taskmanagement.app.repository.TaskRepository;
import com.taskmanagement.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskReminderService {

    @Autowired
    private TaskReminderRepository taskReminderRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;

    @Transactional
    public TaskReminderDto createReminder(TaskReminderDto reminderDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Task task = taskRepository.findById(reminderDto.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + reminderDto.getTaskId()));
        
        if (!task.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task not found with id: " + reminderDto.getTaskId());
        }
        
        TaskReminder reminder = new TaskReminder();
        reminder.setTask(task);
        reminder.setUser(user);
        reminder.setReminderTime(reminderDto.getReminderTime());
        reminder.setReminderType(TaskReminder.ReminderType.valueOf(reminderDto.getReminderType()));
        reminder.setSent(false);
        
        TaskReminder savedReminder = taskReminderRepository.save(reminder);
        return convertToDto(savedReminder);
    }

    @Transactional(readOnly = true)
    public List<TaskReminderDto> getUserReminders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return taskReminderRepository.findByUserAndSent(user, false).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReminder(Long reminderId, Long userId) {
        TaskReminder reminder = taskReminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + reminderId));
        
        if (!reminder.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Reminder not found with id: " + reminderId);
        }
        
        taskReminderRepository.delete(reminder);
    }

    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void processReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<TaskReminder> pendingReminders = taskReminderRepository.findPendingReminders(now);
        
        for (TaskReminder reminder : pendingReminders) {
            try {
                if (reminder.getReminderType() == TaskReminder.ReminderType.EMAIL) {
                    sendEmailReminder(reminder);
                } else {
                    // Handle other notification types
                }
                
                reminder.setSent(true);
                taskReminderRepository.save(reminder);
            } catch (Exception e) {
                // Log the error but continue processing other reminders
                System.err.println("Error processing reminder: " + e.getMessage());
            }
        }
    }
    
    private void sendEmailReminder(TaskReminder reminder) {
        User user = reminder.getUser();
        Task task = reminder.getTask();
        
        String subject = "Task Reminder: " + task.getTitle();
        String body = "Hello " + user.getUsername() + ",\n\n" +
                "This is a reminder for your task: " + task.getTitle() + "\n" +
                "Due date: " + task.getDueDate() + "\n\n" +
                "Description: " + task.getDescription() + "\n\n" +
                "Priority: " + task.getPriority() + "\n\n" +
                "Please complete this task before the due date.\n\n" +
                "Regards,\nTask Management System";
        
        emailService.sendEmail(user.getEmail(), subject, body);
    }

    private TaskReminderDto convertToDto(TaskReminder reminder) {
        TaskReminderDto dto = new TaskReminderDto();
        dto.setTaskId(reminder.getTask().getId());
        dto.setTaskTitle(reminder.getTask().getTitle());
        dto.setDueDate(reminder.getTask().getDueDate());
        dto.setReminderType(reminder.getReminderType().name());
        dto.setReminderTime(reminder.getReminderTime());
        dto.setSent(reminder.isSent());
        return dto;
    }
}
