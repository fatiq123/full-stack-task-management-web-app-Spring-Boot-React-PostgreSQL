package com.taskmanagement.app.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DashboardDto {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;
    private List<TaskDto> upcomingTasks;
    private List<CategoryDto> categories;
    
    // Enhanced dashboard data
    private Map<String, Long> tasksByCategory;
    private Map<String, Long> tasksByPriority;
    private Map<String, Long> tasksByMonth;
    private List<TaskDto> recentTasks;
    private List<TaskDto> upcomingDeadlines;
    private Double completionRate;
    private Map<String, Long> taskCompletionTrend;
    private Long averageCompletionTimeInDays;
}
