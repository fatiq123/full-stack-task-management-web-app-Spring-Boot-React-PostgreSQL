package com.taskmanagement.app.controller;

import com.taskmanagement.app.dto.UserDto;
import com.taskmanagement.app.dto.response.MessageResponse;
import com.taskmanagement.app.security.UserDetailsImpl;
import com.taskmanagement.app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> getUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getId()));
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> updateUserProfile(@Valid @RequestBody UserDto userDto, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        userDto.setId(userDetails.getId());
        return ResponseEntity.ok(userService.updateUserProfile(userDto));
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody PasswordChangeRequest passwordChangeRequest, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.changePassword(passwordChangeRequest.getCurrentPassword(), passwordChangeRequest.getNewPassword(), userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }
    
    @PostMapping(value = "/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetailsImpl userDetails) throws IOException {
        return ResponseEntity.ok(userService.uploadProfilePicture(file, userDetails.getId()));
    }

    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
