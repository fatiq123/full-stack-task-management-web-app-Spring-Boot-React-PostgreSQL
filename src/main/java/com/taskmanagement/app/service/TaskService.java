package com.taskmanagement.app.service;

import com.taskmanagement.app.dto.TaskDto;
import com.taskmanagement.app.dto.TaskFilterDto;
import com.taskmanagement.app.exception.ResourceNotFoundException;
import com.taskmanagement.app.model.Category;
import com.taskmanagement.app.model.Task;
import com.taskmanagement.app.model.User;
import com.taskmanagement.app.repository.CategoryRepository;
import com.taskmanagement.app.repository.TaskRepository;
import com.taskmanagement.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasksByUserId(Long userId) {
        User user = getUserById(userId);
        return taskRepository.findByUserOrderByDueDateAsc(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByPriority(Long userId) {
        User user = getUserById(userId);
        return taskRepository.findByUserOrderByPriorityDesc(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getCompletedTasks(Long userId) {
        User user = getUserById(userId);
        return taskRepository.findByUserAndCompletedOrderByDueDateAsc(user, true).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getPendingTasks(Long userId) {
        User user = getUserById(userId);
        return taskRepository.findByUserAndCompletedOrderByDueDateAsc(user, false).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getOverdueTasks(Long userId) {
        User user = getUserById(userId);
        return taskRepository.findOverdueTasks(user, LocalDateTime.now()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long id, Long userId) {
        User user = getUserById(userId);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        
        return convertToDto(task);
    }

    @Transactional
    public TaskDto createTask(TaskDto taskDto) {
        User user = getUserById(taskDto.getUserId());
        
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());
        task.setPriority(taskDto.getPriority());
        task.setCompleted(taskDto.isCompleted());
        task.setUser(user);
        
        if (taskDto.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUser(taskDto.getCategoryId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + taskDto.getCategoryId()));
            task.setCategory(category);
        }
        
        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    @Transactional
    public TaskDto updateTask(TaskDto taskDto) {
        User user = getUserById(taskDto.getUserId());
        
        Task task = taskRepository.findById(taskDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskDto.getId()));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found with id: " + taskDto.getId());
        }
        
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());
        task.setPriority(taskDto.getPriority());
        task.setCompleted(taskDto.isCompleted());
        
        if (taskDto.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUser(taskDto.getCategoryId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + taskDto.getCategoryId()));
            task.setCategory(category);
        } else {
            task.setCategory(null);
        }
        
        Task updatedTask = taskRepository.save(task);
        return convertToDto(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id, Long userId) {
        User user = getUserById(userId);
        
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        
        taskRepository.delete(task);
    }

    @Transactional
    public TaskDto toggleTaskCompletion(Long id, Long userId) {
        User user = getUserById(userId);
        
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        
        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        
        task.setCompleted(!task.isCompleted());
        Task updatedTask = taskRepository.save(task);
        
        return convertToDto(updatedTask);
    }
    
    // New methods for filtering and sorting
    @Transactional(readOnly = true)
    public Page<TaskDto> filterTasks(TaskFilterDto filterDto, int page, int size, Long userId) {
        User user = getUserById(userId);
        
        // Create sort object based on filter criteria
        Sort sort = Sort.by(
            filterDto.getSortDirection().equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC, 
            filterDto.getSortBy()
        );
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Build dynamic query based on filter criteria
        Specification<Task> spec = Specification.where((root, query, cb) -> cb.equal(root.get("user"), user));
        
        if (filterDto.getSearchTerm() != null && !filterDto.getSearchTerm().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + filterDto.getSearchTerm().toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + filterDto.getSearchTerm().toLowerCase() + "%")
                )
            );
        }
        
        if (filterDto.getPriority() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("priority"), filterDto.getPriority()));
        }
        
        if (filterDto.getCategoryId() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), filterDto.getCategoryId()));
        }
        
        if (filterDto.getCompleted() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("completed"), filterDto.getCompleted()));
        }
        
        if (filterDto.getStartDate() != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dueDate"), filterDto.getStartDate()));
        }
        
        if (filterDto.getEndDate() != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("dueDate"), filterDto.getEndDate()));
        }
        
        return taskRepository.findAll(spec, pageable).map(this::convertToDto);
    }
    
    // Method for upcoming tasks (for reminders)
    @Transactional(readOnly = true)
    public List<TaskDto> getUpcomingTasks(Long userId, int days) {
        User user = getUserById(userId);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = now.plusDays(days);
        
        return taskRepository.findUpcomingTasks(user, now, endDate).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private TaskDto convertToDto(Task task) {
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setDueDate(task.getDueDate());
        taskDto.setPriority(task.getPriority());
        taskDto.setCompleted(task.isCompleted());
        taskDto.setCreatedAt(task.getCreatedAt());
        taskDto.setUpdatedAt(task.getUpdatedAt());
        taskDto.setUserId(task.getUser().getId());
        
        if (task.getCategory() != null) {
            taskDto.setCategoryId(task.getCategory().getId());
            taskDto.setCategoryName(task.getCategory().getName());
        }
        
        return taskDto;
    }
}
