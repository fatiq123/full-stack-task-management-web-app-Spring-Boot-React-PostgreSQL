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
import java.util.List;
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
        
        return dashboardDto;
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
