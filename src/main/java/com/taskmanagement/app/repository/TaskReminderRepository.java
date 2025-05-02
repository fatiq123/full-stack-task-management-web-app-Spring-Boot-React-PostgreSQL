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
    List<TaskReminder> findByUserAndSent(User user, boolean sent);
    
    @Query("SELECT tr FROM TaskReminder tr WHERE tr.sent = false AND tr.reminderTime <= ?1")
    List<TaskReminder> findPendingReminders(LocalDateTime currentTime);
    
    List<TaskReminder> findByTaskId(Long taskId);
    
    void deleteByTaskId(Long taskId);
}
