package com.resumeai.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    public void addResourcesHandlers(ResourceHandlerRegistry registry) {
        // Path to your uploads directory
        Path uploadDir = Paths.get(System.getProperty("user.home"), "resumeai", "uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        System.out.println("Profile Image Path : " + uploadPath);

        // Map URL path "/uploads/**" to that folder
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
