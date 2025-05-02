package com.taskmanagement.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryDto {
    private Long id;
    
    @NotBlank
    private String name;
    
    private String description;
    
    private int taskCount;
    
    private Long userId;
}
