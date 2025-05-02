package com.taskmanagement.app.service;

import com.taskmanagement.app.dto.CategoryDto;
import com.taskmanagement.app.dto.DashboardDto;
import com.taskmanagement.app.dto.TaskDto;
import com.taskmanagement.app.exception.ResourceNotFoundException;
import com.taskmanagement.app.model.Task;
import com.taskmanagement.app.model.User;
import com.taskmanagement.app.repository.CategoryRepository;
import com.taskmanagement.app.repository.TaskRepository;
import com.taskmanagement.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskService taskService;

    @Autowired
    private CategoryService categoryService;

    @Transactional(readOnly = true)
    public DashboardDto getDashboardData(Long userId) {
        User user = getUserById(userId);
        
        DashboardDto dashboardDto = new DashboardDto();
        
        // Get task counts
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByUserAndCompleted(user, true);
        long pendingTasks = taskRepository.countByUserAndCompleted(user, false);
        
        // Get overdue tasks
        List<Task> overdueTasks = taskRepository.findOverdueTasks(user, LocalDateTime.now());
        
        // Get upcoming tasks (due in the next 7 days)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextWeek = now.plusDays(7);
        List<Task> upcomingTasks = taskRepository.findByUserOrderByDueDateAsc(user).stream()
                .filter(task -> !task.isCompleted() && task.getDueDate().isAfter(now) && task.getDueDate().isBefore(nextWeek))
                .limit(5)
                .collect(Collectors.toList());
        
        // Get categories
        List<CategoryDto> categories = categoryService.getAllCategoriesByUserId(userId);
        
        // Populate dashboard DTO
        dashboardDto.setTotalTasks(totalTasks);
        dashboardDto.setCompletedTasks(completedTasks);
        dashboardDto.setPendingTasks(pendingTasks);
        dashboardDto.setOverdueTasks(overdueTasks.size());
        dashboardDto.setUpcomingTasks(upcomingTasks.stream()
                .map(task -> {
                    TaskDto taskDto = new TaskDto();
                    taskDto.setId(task.getId());
                    taskDto.setTitle(task.getTitle());
                    taskDto.setDueDate(task.getDueDate());
                    taskDto.setPriority(task.getPriority());
                    taskDto.setUserId(userId);
                    if (task.getCategory() != null) {
                        taskDto.setCategoryName(task.getCategory().getName());
                    }
                    return taskDto;
                })
                .collect(Collectors.toList()));
        dashboardDto.setCategories(categories);
        
        // Enhanced dashboard data
        
        // Get all tasks for the user
        List<Task> allTasks = taskRepository.findByUserOrderByDueDateAsc(user);
        
        // Tasks by category
        Map<String, Long> tasksByCategory = new HashMap<>();
        categories.forEach(category -> {
            long count = allTasks.stream()
                    .filter(task -> task.getCategory() != null && 
                           task.getCategory().getId().equals(category.getId()))
                    .count();
            tasksByCategory.put(category.getName(), count);
        });
        dashboardDto.setTasksByCategory(tasksByCategory);
        
        // Tasks by priority
        Map<String, Long> tasksByPriority = new HashMap<>();
        for (Task.Priority priority : Task.Priority.values()) {
            long count = allTasks.stream()
                    .filter(task -> task.getPriority() == priority)
                    .count();
            tasksByPriority.put(priority.name(), count);
        }
        dashboardDto.setTasksByPriority(tasksByPriority);
        
        // Tasks by month (for the current year)
        Map<String, Long> tasksByMonth = new HashMap<>();
        int currentYear = LocalDateTime.now().getYear();
        for (int month = 1; month <= 12; month++) {
            final int m = month;
            long count = allTasks.stream()
                    .filter(task -> task.getCreatedAt().getYear() == currentYear && 
                                   task.getCreatedAt().getMonthValue() == m)
                    .count();
            tasksByMonth.put(String.valueOf(month), count);
        }
        dashboardDto.setTasksByMonth(tasksByMonth);
        
        // Recent tasks (last 5)
        List<TaskDto> recentTasks = allTasks.stream()
                .sorted(Comparator.comparing(Task::getCreatedAt).reversed())
                .limit(5)
                .map(task -> {
                    TaskDto taskDto = new TaskDto();
                    taskDto.setId(task.getId());
                    taskDto.setTitle(task.getTitle());
                    taskDto.setDueDate(task.getDueDate());
                    taskDto.setPriority(task.getPriority());
                    taskDto.setCompleted(task.isCompleted());
                    taskDto.setUserId(userId);
                    if (task.getCategory() != null) {
                        taskDto.setCategoryName(task.getCategory().getName());
                    }
                    return taskDto;
                })
                .collect(Collectors.toList());
        dashboardDto.setRecentTasks(recentTasks);
        
        // Upcoming deadlines (next 5 due tasks)
        List<TaskDto> upcomingDeadlines = allTasks.stream()
                .filter(task -> !task.isCompleted() && task.getDueDate().isAfter(now))
                .sorted(Comparator.comparing(Task::getDueDate))
                .limit(5)
                .map(task -> {
                    TaskDto taskDto = new TaskDto();
                    taskDto.setId(task.getId());
                    taskDto.setTitle(task.getTitle());
                    taskDto.setDueDate(task.getDueDate());
                    taskDto.setPriority(task.getPriority());
                    taskDto.setUserId(userId);
                    if (task.getCategory() != null) {
                        taskDto.setCategoryName(task.getCategory().getName());
                    }
                    return taskDto;
                })
                .collect(Collectors.toList());
        dashboardDto.setUpcomingDeadlines(upcomingDeadlines);
        
        // Completion rate
        if (totalTasks > 0) {
            double completionRate = (double) completedTasks / totalTasks * 100;
            dashboardDto.setCompletionRate(Math.round(completionRate * 100.0) / 100.0); // Round to 2 decimal places
        } else {
            dashboardDto.setCompletionRate(0.0);
        }
        
        // Task completion trend (last 6 months)
        Map<String, Long> taskCompletionTrend = new HashMap<>();
        LocalDateTime sixMonthsAgo = now.minusMonths(6);
        for (int i = 0; i < 6; i++) {
            LocalDateTime monthStart = sixMonthsAgo.plusMonths(i);
            LocalDateTime monthEnd = monthStart.plusMonths(1);
            final LocalDateTime ms = monthStart;
            final LocalDateTime me = monthEnd;
            
            long completedInMonth = allTasks.stream()
                    .filter(task -> task.isCompleted() && 
                                   task.getUpdatedAt().isAfter(ms) && 
                                   task.getUpdatedAt().isBefore(me))
                    .count();
            
            taskCompletionTrend.put(monthStart.getMonth().toString(), completedInMonth);
        }
        dashboardDto.setTaskCompletionTrend(taskCompletionTrend);
        
        // Average completion time in days
        List<Task> completedTasksList = allTasks.stream()
                .filter(Task::isCompleted)
                .collect(Collectors.toList());
        
        if (!completedTasksList.isEmpty()) {
            long totalDays = completedTasksList.stream()
                    .mapToLong(task -> ChronoUnit.DAYS.between(task.getCreatedAt(), task.getUpdatedAt()))
                    .sum();
            dashboardDto.setAverageCompletionTimeInDays(totalDays / completedTasksList.size());
        } else {
            dashboardDto.setAverageCompletionTimeInDays(0L);
        }
        
        return dashboardDto;
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
