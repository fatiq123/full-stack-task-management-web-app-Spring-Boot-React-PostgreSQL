package com.taskmanagement.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

    @Bean
    public Path fileStorageLocation() {
        return Paths.get("uploads").toAbsolutePath().normalize();
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map the /uploads/** URL pattern to the physical location where files are stored
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
