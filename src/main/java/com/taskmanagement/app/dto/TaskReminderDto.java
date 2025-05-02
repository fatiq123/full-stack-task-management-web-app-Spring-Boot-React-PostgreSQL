package com.taskmanagement.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskReminderDto {
    private Long taskId;
    private String taskTitle;
    private LocalDateTime dueDate;
    private String reminderType; // "EMAIL", "NOTIFICATION"
    private LocalDateTime reminderTime;
    private boolean sent;
}
