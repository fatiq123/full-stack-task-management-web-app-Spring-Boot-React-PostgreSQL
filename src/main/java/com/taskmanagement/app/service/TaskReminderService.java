package com.taskmanagement.app.service;

import com.taskmanagement.app.dto.TaskDto;
import com.taskmanagement.app.dto.TaskReminderDto;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskReminderService {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private TaskReminderRepository reminderRepository;

    // Check for overdue tasks every day at 8:00 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkOverdueTasks() {
        LocalDateTime now = LocalDateTime.now();
        
        // Get all users
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            // Get overdue tasks for this user
            List<Task> overdueTasks = taskRepository.findOverdueTasks(user, now);
            
            // Send notifications for each overdue task
            for (Task task : overdueTasks) {
                if (!task.isCompleted()) {
                    TaskDto taskDto = convertToDto(task);
                    emailService.sendTaskOverdueNotification(taskDto, user.getId());
                }
            }
        }
    }
    
    // Send weekly task summary every Sunday at 7:00 PM
    @Scheduled(cron = "0 0 19 * * SUN")
    public void sendWeeklyTaskSummary() {
        // Get all users
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            // Get task statistics
            Map<String, Object> taskStats = getTaskStatistics(user.getId());
            
            // Get upcoming tasks for the next 7 days
            List<TaskDto> upcomingTasks = taskService.getUpcomingTasks(user.getId(), 7);
            
            // Send task summary email
            emailService.sendTaskSummary(user.getId(), taskStats, upcomingTasks);
        }
    }
    
    private Map<String, Object> getTaskStatistics(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return stats;
        
        List<Task> allTasks = taskRepository.findByUser(user);
        List<Task> completedTasks = taskRepository.findByUserAndCompleted(user, true);
        List<Task> pendingTasks = taskRepository.findByUserAndCompleted(user, false);
        List<Task> overdueTasks = taskRepository.findOverdueTasks(user, LocalDateTime.now());
        
        stats.put("totalTasks", allTasks.size());
        stats.put("completedTasks", completedTasks.size());
        stats.put("pendingTasks", pendingTasks.size());
        stats.put("overdueTasks", overdueTasks.size());
        
        return stats;
    }
    
    private TaskDto convertToDto(Task task) {
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setDueDate(task.getDueDate());
        taskDto.setPriority(task.getPriority());
        taskDto.setCompleted(task.isCompleted());
        taskDto.setCreatedAt(task.getCreatedAt());
        taskDto.setUpdatedAt(task.getUpdatedAt());
        taskDto.setUserId(task.getUser().getId());
        
        if (task.getCategory() != null) {
            taskDto.setCategoryId(task.getCategory().getId());
            taskDto.setCategoryName(task.getCategory().getName());
        }
        
        return taskDto;
    }
    
    /**
     * Get all reminders for a specific user
     */
    public List<TaskReminderDto> getUserReminders(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        List<TaskReminder> reminders = reminderRepository.findByUserOrderByReminderTimeAsc(user);
        
        return reminders.stream()
            .map(this::convertToReminderDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Create a new reminder for a task
     */
    @Transactional
    public TaskReminderDto createReminder(TaskReminderDto reminderDto, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        Task task = taskRepository.findById(reminderDto.getTaskId())
            .orElseThrow(() -> new RuntimeException("Task not found"));
            
        // Verify the task belongs to the user
        if (!task.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to set reminders for this task");
        }
        
        TaskReminder reminder = new TaskReminder();
        reminder.setTask(task);
        reminder.setUser(user);
        reminder.setReminderType(reminderDto.getReminderType());
        reminder.setReminderTime(reminderDto.getReminderTime());
        reminder.setSent(false);
        
        reminder = reminderRepository.save(reminder);
        
        return convertToReminderDto(reminder);
    }
    
    /**
     * Delete a reminder
     */
    @Transactional
    public void deleteReminder(Long reminderId, Long userId) {
        TaskReminder reminder = reminderRepository.findById(reminderId)
            .orElseThrow(() -> new RuntimeException("Reminder not found"));
            
        // Verify the reminder belongs to the user
        if (!reminder.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this reminder");
        }
        
        reminderRepository.delete(reminder);
    }
    
    /**
     * Process pending reminders
     */
    @Scheduled(fixedRate = 60000) // Check every minute
    public void processPendingReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<TaskReminder> pendingReminders = reminderRepository.findPendingReminders(now);
        
        for (TaskReminder reminder : pendingReminders) {
            // Send notification based on reminder type
            if ("EMAIL".equals(reminder.getReminderType())) {
                TaskDto taskDto = convertToDto(reminder.getTask());
                emailService.sendTaskReminderNotification(taskDto, reminder.getUser().getId());
            }
            
            // Mark as sent
            reminder.setSent(true);
            reminderRepository.save(reminder);
        }
    }
    
    /**
     * Convert TaskReminder entity to DTO
     */
    private TaskReminderDto convertToReminderDto(TaskReminder reminder) {
        TaskReminderDto dto = new TaskReminderDto();
        dto.setTaskId(reminder.getTask().getId());
        dto.setTaskTitle(reminder.getTask().getTitle());
        dto.setDueDate(reminder.getTask().getDueDate());
        dto.setReminderType(reminder.getReminderType());
        dto.setReminderTime(reminder.getReminderTime());
        dto.setSent(reminder.isSent());
        return dto;
    }
}
