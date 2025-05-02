package com.taskmanagement.app.service;

import com.taskmanagement.app.dto.TaskDto;
import com.taskmanagement.app.exception.ResourceNotFoundException;
import com.taskmanagement.app.model.Category;
import com.taskmanagement.app.model.Task;
import com.taskmanagement.app.model.User;
import com.taskmanagement.app.repository.CategoryRepository;
import com.taskmanagement.app.repository.TaskRepository;
import com.taskmanagement.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
