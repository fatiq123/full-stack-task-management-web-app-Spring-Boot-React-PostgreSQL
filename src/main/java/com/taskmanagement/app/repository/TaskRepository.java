package com.taskmanagement.app.repository;

import com.taskmanagement.app.model.Task;
import com.taskmanagement.app.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    List<Task> findByUserOrderByDueDateAsc(User user);
    
    List<Task> findByUserOrderByPriorityDesc(User user);
    
    List<Task> findByUserAndCompletedOrderByDueDateAsc(User user, boolean completed);
    
    @Query("SELECT t FROM Task t WHERE t.user = ?1 AND t.dueDate < ?2 AND t.completed = false")
    List<Task> findOverdueTasks(User user, LocalDateTime currentDate);
    
    List<Task> findByUserAndCategoryId(User user, Long categoryId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user = ?1 AND t.completed = ?2")
    Long countByUserAndCompleted(User user, boolean completed);
    
    // New methods for filtering and sorting
    Page<Task> findByUser(User user, Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE t.user = ?1 AND " +
           "(?2 IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', ?2, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', ?2, '%')))")
    Page<Task> findByUserAndSearchTerm(User user, String searchTerm, Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE t.user = ?1 AND " +
           "(?2 IS NULL OR t.dueDate >= ?2) AND " +
           "(?3 IS NULL OR t.dueDate <= ?3)")
    Page<Task> findByUserAndDateRange(User user, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    @Query("SELECT t FROM Task t WHERE t.user = ?1 AND " +
           "(?2 IS NULL OR t.priority = ?2) AND " +
           "(?3 IS NULL OR t.category.id = ?3) AND " +
           "(?4 IS NULL OR t.completed = ?4)")
    Page<Task> findByUserAndFilters(User user, Task.Priority priority, Long categoryId, Boolean completed, Pageable pageable);
    
    // Method for upcoming tasks (for reminders)
    @Query("SELECT t FROM Task t WHERE t.user = ?1 AND t.dueDate BETWEEN ?2 AND ?3 AND t.completed = false ORDER BY t.dueDate ASC")
    List<Task> findUpcomingTasks(User user, LocalDateTime startDate, LocalDateTime endDate);
}
