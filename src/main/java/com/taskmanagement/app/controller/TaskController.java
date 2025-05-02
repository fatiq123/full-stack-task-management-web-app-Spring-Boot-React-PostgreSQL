package com.taskmanagement.app.controller;

import com.taskmanagement.app.dto.TaskDto;
import com.taskmanagement.app.dto.TaskFilterDto;
import com.taskmanagement.app.security.UserDetailsImpl;
import com.taskmanagement.app.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskDto>> getAllTasks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getAllTasksByUserId(userDetails.getId()));
    }

    @GetMapping("/priority")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskDto>> getTasksByPriority(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getTasksByPriority(userDetails.getId()));
    }

    @GetMapping("/completed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskDto>> getCompletedTasks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getCompletedTasks(userDetails.getId()));
    }

    @GetMapping("/pending")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskDto>> getPendingTasks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getPendingTasks(userDetails.getId()));
    }

    @GetMapping("/overdue")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskDto>> getOverdueTasks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getOverdueTasks(userDetails.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getTaskById(id, userDetails.getId()));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskDto taskDto, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        taskDto.setUserId(userDetails.getId());
        return ResponseEntity.ok(taskService.createTask(taskDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @Valid @RequestBody TaskDto taskDto, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        taskDto.setId(id);
        taskDto.setUserId(userDetails.getId());
        return ResponseEntity.ok(taskService.updateTask(taskDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        taskService.deleteTask(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-completion")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskDto> toggleTaskCompletion(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.toggleTaskCompletion(id, userDetails.getId()));
    }
    
    // New endpoints for filtering and sorting
    @PostMapping("/filter")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<TaskDto>> filterTasks(
            @RequestBody TaskFilterDto filterDto,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.filterTasks(filterDto, page, size, userDetails.getId()));
    }
    
    // Endpoint for upcoming tasks (for reminders)
    @GetMapping("/upcoming")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskDto>> getUpcomingTasks(
            @RequestParam(defaultValue = "7") int days,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getUpcomingTasks(userDetails.getId(), days));
    }
}
