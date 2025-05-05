package com.taskmanagement.app.repository;

import com.taskmanagement.app.model.TaskReminder;
import com.taskmanagement.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskReminderRepository extends JpaRepository<TaskReminder, Long> {
    List<TaskReminder> findByUserOrderByReminderTimeAsc(User user);
    
    @Query("SELECT r FROM TaskReminder r WHERE r.user = ?1 AND r.task.id = ?2")
    List<TaskReminder> findByUserAndTaskId(User user, Long taskId);
    
    @Query("SELECT r FROM TaskReminder r WHERE r.reminderTime <= ?1 AND r.sent = false")
    List<TaskReminder> findPendingReminders(LocalDateTime now);
    
    void deleteByTaskId(Long taskId);
}
