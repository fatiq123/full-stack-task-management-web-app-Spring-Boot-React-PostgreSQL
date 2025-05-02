package com.taskmanagement.app.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardDto {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;
    private List<TaskDto> upcomingTasks;
    private List<CategoryDto> categories;
}
