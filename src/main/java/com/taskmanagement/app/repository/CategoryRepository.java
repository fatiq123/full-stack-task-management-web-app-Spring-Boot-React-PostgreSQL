package com.taskmanagement.app.repository;

import com.taskmanagement.app.model.Category;
import com.taskmanagement.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(User user);
    
    Optional<Category> findByIdAndUser(Long id, User user);
    
    boolean existsByNameAndUser(String name, User user);
}
