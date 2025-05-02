package com.taskmanagement.app.dto;

import com.taskmanagement.app.model.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskDto {
    private Long id;
    
    @NotBlank
    private String title;
    
    private String description;
    
    @NotNull
    private LocalDateTime dueDate;
    
    @NotNull
    private Task.Priority priority;
    
    private boolean completed;
    
    private Long categoryId;
    
    private String categoryName;
    
    private Long userId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
