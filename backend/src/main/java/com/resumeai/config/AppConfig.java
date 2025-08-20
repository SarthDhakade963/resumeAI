package com.resumeai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class AppConfig {
    @Bean
    public Path defaultProfilePic() {
        // This will be used in UserProfileServiceImpl
        return Paths.get(System.getProperty("user.home"), "resumai", "uploads", "profile-pics", "user.png");
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // uses bcrypt for hashing
    }
}
