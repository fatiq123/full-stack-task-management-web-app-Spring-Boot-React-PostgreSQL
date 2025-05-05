package com.taskmanagement.app.service;

import com.taskmanagement.app.dto.TaskDto;
import com.taskmanagement.app.model.User;
import com.taskmanagement.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SpringTemplateEngine templateEngine;
    
    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a");
    
    /**
     * Send notification for task creation
     */
    public void sendTaskCreationNotification(TaskDto task, Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getEmail() == null) return;
        
        try {
            // Prepare the evaluation context
            final Context ctx = new Context(Locale.US);
            ctx.setVariable("username", user.getUsername());
            ctx.setVariable("taskTitle", task.getTitle());
            ctx.setVariable("taskDescription", task.getDescription());
            ctx.setVariable("dueDate", formatDate(task.getDueDate()));
            ctx.setVariable("taskPriority", task.getPriority());
            ctx.setVariable("taskUrl", frontendUrl + "/tasks/" + task.getId());
            
            // Create the HTML body using Thymeleaf
            final String htmlContent = templateEngine.process("emails/task-created", ctx);
            
            // Send email
            sendHtmlEmail(user.getEmail(), "New Task Created: " + task.getTitle(), htmlContent);
        } catch (Exception e) {
            // Log the error but don't throw it to prevent disrupting the application flow
            System.err.println("Failed to send task creation email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Send notification for task completion
     */
    public void sendTaskCompletedNotification(TaskDto task, Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getEmail() == null) return;
        
        try {
            // Prepare the evaluation context
            final Context ctx = new Context(Locale.US);
            ctx.setVariable("username", user.getUsername());
            ctx.setVariable("taskTitle", task.getTitle());
            ctx.setVariable("taskDescription", task.getDescription());
            ctx.setVariable("taskPriority", task.getPriority());
            ctx.setVariable("completionDate", formatDate(task.getUpdatedAt()));
            ctx.setVariable("dashboardUrl", frontendUrl + "/dashboard");
            
            // Create the HTML body using Thymeleaf
            final String htmlContent = templateEngine.process("emails/task-completed", ctx);
            
            // Send email
            sendHtmlEmail(user.getEmail(), "Task Completed: " + task.getTitle(), htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send task completion email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Send notification for task deletion
     */
    public void sendTaskDeletedNotification(TaskDto task, Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getEmail() == null) return;
        
        try {
            // Prepare the evaluation context
            final Context ctx = new Context(Locale.US);
            ctx.setVariable("username", user.getUsername());
            ctx.setVariable("taskTitle", task.getTitle());
            ctx.setVariable("taskDescription", task.getDescription());
            ctx.setVariable("dueDate", formatDate(task.getDueDate()));
            ctx.setVariable("taskPriority", task.getPriority());
            ctx.setVariable("createTaskUrl", frontendUrl + "/tasks/new");
            
            // Create the HTML body using Thymeleaf
            final String htmlContent = templateEngine.process("emails/task-deleted", ctx);
            
            // Send email
            sendHtmlEmail(user.getEmail(), "Task Deleted: " + task.getTitle(), htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send task deletion email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Send notification for overdue tasks
     */
    public void sendTaskOverdueNotification(TaskDto task, Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getEmail() == null) return;
        
        try {
            // Calculate days overdue
            long daysOverdue = ChronoUnit.DAYS.between(task.getDueDate(), LocalDateTime.now());
            
            // Prepare the evaluation context
            final Context ctx = new Context(Locale.US);
            ctx.setVariable("username", user.getUsername());
            ctx.setVariable("taskTitle", task.getTitle());
            ctx.setVariable("dueDate", formatDate(task.getDueDate()));
            ctx.setVariable("taskPriority", task.getPriority());
            ctx.setVariable("daysOverdue", daysOverdue);
            ctx.setVariable("taskUrl", frontendUrl + "/tasks/" + task.getId());
            
            // Create the HTML body using Thymeleaf
            final String htmlContent = templateEngine.process("emails/task-overdue", ctx);
            
            // Send email
            sendHtmlEmail(user.getEmail(), "Task Overdue: " + task.getTitle(), htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send task overdue email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Send task reminder notification
     */
    public void sendTaskReminderNotification(TaskDto task, Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getEmail() == null) return;
        
        try {
            // Calculate time remaining
            LocalDateTime now = LocalDateTime.now();
            String timeRemaining;
            
            if (task.getDueDate().isBefore(now)) {
                timeRemaining = "Overdue";
            } else {
                long days = ChronoUnit.DAYS.between(now, task.getDueDate());
                long hours = ChronoUnit.HOURS.between(now, task.getDueDate()) % 24;
                timeRemaining = days + " days, " + hours + " hours";
            }
            
            // Prepare the evaluation context
            final Context ctx = new Context(Locale.US);
            ctx.setVariable("username", user.getUsername());
            ctx.setVariable("taskTitle", task.getTitle());
            ctx.setVariable("dueDate", formatDate(task.getDueDate()));
            ctx.setVariable("taskPriority", task.getPriority());
            ctx.setVariable("timeRemaining", timeRemaining);
            ctx.setVariable("taskUrl", frontendUrl + "/tasks/" + task.getId());
            
            // Create the HTML body using Thymeleaf
            final String htmlContent = templateEngine.process("emails/task-reminder", ctx);
            
            // Send email
            sendHtmlEmail(user.getEmail(), "Task Reminder: " + task.getTitle(), htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send task reminder email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Send weekly task summary
     */
    public void sendTaskSummary(Long userId, Map<String, Object> taskStats, List<TaskDto> upcomingTasks) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getEmail() == null) return;
        
        try {
            // Prepare the evaluation context
            final Context ctx = new Context(Locale.US);
            ctx.setVariable("username", user.getUsername());
            ctx.setVariable("totalTasks", taskStats.get("totalTasks"));
            ctx.setVariable("completedTasks", taskStats.get("completedTasks"));
            ctx.setVariable("pendingTasks", taskStats.get("pendingTasks"));
            ctx.setVariable("overdueTasks", taskStats.get("overdueTasks"));
            ctx.setVariable("upcomingTasks", upcomingTasks);
            ctx.setVariable("dashboardUrl", frontendUrl + "/dashboard");
            
            // Create the HTML body using Thymeleaf
            final String htmlContent = templateEngine.process("emails/weekly-summary", ctx);
            
            // Send email
            sendHtmlEmail(user.getEmail(), "Weekly Task Summary", htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send weekly summary email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Helper method to send HTML emails
     */
    private void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true indicates HTML content
        
        mailSender.send(message);
    }
    
    /**
     * Format date for display in emails
     */
    private String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) return "Not set";
        return dateTime.format(DATE_FORMATTER);
    }
}
