package com.taskmanagement.app.service;

import com.taskmanagement.app.dto.UserDto;
import com.taskmanagement.app.exception.ResourceNotFoundException;
import com.taskmanagement.app.model.User;
import com.taskmanagement.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserDto getUserProfile(Long userId) {
        User user = getUserById(userId);
        return convertToDto(user);
    }

    @Transactional
    public UserDto updateUserProfile(UserDto userDto) {
        User user = getUserById(userDto.getId());
        
        // Check if email is already in use by another user
        if (!user.getEmail().equals(userDto.getEmail()) && 
            userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }
        
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        
        if (userDto.getProfilePicture() != null) {
            user.setProfilePicture(userDto.getProfilePicture());
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    @Transactional
    public void changePassword(String currentPassword, String newPassword, Long userId) {
        User user = getUserById(userId);
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    @Transactional
    public UserDto uploadProfilePicture(MultipartFile file, Long userId) throws IOException {
        User user = getUserById(userId);
        
        // Process the image to reduce its size if needed
        byte[] imageBytes = file.getBytes();
        
        // If the image is too large, we'll store a URL reference instead of the full Base64
        // For this example, we'll use a simple approach to handle smaller images
        if (imageBytes.length > 100000) { // If larger than ~100KB
            // For larger images, store a URL or reference instead of the full Base64 string
            // This is a simplified approach - in production you might want to use cloud storage
            String fileExtension = getFileExtension(file.getOriginalFilename());
            String profilePicUrl = "user_" + userId + "_profile" + fileExtension;
            user.setProfilePicture(profilePicUrl);
            
            // Here you would typically save the actual file to disk or cloud storage
            // For this example, we'll just store the URL reference
        } else {
            // For smaller images, we can store as Base64
            String base64Image = "data:" + file.getContentType() + ";base64," + 
                                Base64.getEncoder().encodeToString(imageBytes);
            user.setProfilePicture(base64Image);
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }
    
    private String getFileExtension(String filename) {
        if (filename == null) return ".jpg";
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) return ".jpg";
        return filename.substring(lastDotIndex);
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setName(user.getName());
        userDto.setProfilePicture(user.getProfilePicture());
        
        return userDto;
    }
}
