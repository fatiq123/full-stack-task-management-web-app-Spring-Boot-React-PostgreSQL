package com.taskmanagement.app.repository;

import com.taskmanagement.app.model.Task;
import com.taskmanagement.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserOrderByDueDateAsc(User user);
    
    List<Task> findByUserOrderByPriorityDesc(User user);
    
    List<Task> findByUserAndCompletedOrderByDueDateAsc(User user, boolean completed);
    
    @Query("SELECT t FROM Task t WHERE t.user = ?1 AND t.dueDate < ?2 AND t.completed = false")
    List<Task> findOverdueTasks(User user, LocalDateTime currentDate);
    
    List<Task> findByUserAndCategoryId(User user, Long categoryId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user = ?1 AND t.completed = ?2")
    Long countByUserAndCompleted(User user, boolean completed);
}
