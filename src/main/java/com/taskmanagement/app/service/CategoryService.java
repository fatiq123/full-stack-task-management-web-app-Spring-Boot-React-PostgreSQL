package com.taskmanagement.app.service;

import com.taskmanagement.app.dto.CategoryDto;
import com.taskmanagement.app.exception.ResourceNotFoundException;
import com.taskmanagement.app.model.Category;
import com.taskmanagement.app.model.User;
import com.taskmanagement.app.repository.CategoryRepository;
import com.taskmanagement.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategoriesByUserId(Long userId) {
        User user = getUserById(userId);
        return categoryRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id, Long userId) {
        User user = getUserById(userId);
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        return convertToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto categoryDto) {
        User user = getUserById(categoryDto.getUserId());
        
        if (categoryRepository.existsByNameAndUser(categoryDto.getName(), user)) {
            throw new IllegalArgumentException("Category with name '" + categoryDto.getName() + "' already exists");
        }
        
        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        category.setUser(user);
        
        Category savedCategory = categoryRepository.save(category);
        return convertToDto(savedCategory);
    }

    @Transactional
    public CategoryDto updateCategory(CategoryDto categoryDto) {
        User user = getUserById(categoryDto.getUserId());
        
        Category category = categoryRepository.findByIdAndUser(categoryDto.getId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryDto.getId()));
        
        // Check if the new name already exists for another category
        if (!category.getName().equals(categoryDto.getName()) && 
            categoryRepository.existsByNameAndUser(categoryDto.getName(), user)) {
            throw new IllegalArgumentException("Category with name '" + categoryDto.getName() + "' already exists");
        }
        
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        
        Category updatedCategory = categoryRepository.save(category);
        return convertToDto(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id, Long userId) {
        User user = getUserById(userId);
        
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        categoryRepository.delete(category);
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private CategoryDto convertToDto(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        categoryDto.setDescription(category.getDescription());
        categoryDto.setTaskCount(category.getTasks().size());
        categoryDto.setUserId(category.getUser().getId());
        
        return categoryDto;
    }
}
