package com.taskmanagement.app.dto;

import com.taskmanagement.app.model.Task;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskFilterDto {
    private String searchTerm;
    private Task.Priority priority;
    private Long categoryId;
    private Boolean completed;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String sortBy = "dueDate"; // default sort field
    private String sortDirection = "asc"; // asc or desc
}
