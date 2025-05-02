package com.taskmanagement.app.controller;

import com.taskmanagement.app.dto.TaskReminderDto;
import com.taskmanagement.app.security.UserDetailsImpl;
import com.taskmanagement.app.service.TaskReminderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/reminders")
public class TaskReminderController {

    @Autowired
    private TaskReminderService reminderService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskReminderDto>> getUserReminders(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(reminderService.getUserReminders(userDetails.getId()));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskReminderDto> createReminder(@Valid @RequestBody TaskReminderDto reminderDto, 
                                                         @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(reminderService.createReminder(reminderDto, userDetails.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id, 
                                              @AuthenticationPrincipal UserDetailsImpl userDetails) {
        reminderService.deleteReminder(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
