package com.resumeai.service.Impl;

import com.resumeai.dto.UserDTO;
import com.resumeai.mapper.UserMapper;
import com.resumeai.model.User;
import com.resumeai.repository.UserRepository;
import com.resumeai.service.Signable;
import com.resumeai.service.UserProfileService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UserProfileServiceImpl extends Signable implements UserProfileService {
    private final Path defaultProfilePic;

    public UserProfileServiceImpl(UserRepository userRepository, Path defaultProfilePic) {
        super(userRepository);
        this.defaultProfilePic = defaultProfilePic;
    }

    @Override
    public UserDTO getUserDTO() {
        User user = getLoggedInUser();

        return UserMapper.toDTO(user);
    }

    @Override
    public UserDTO updateUser(UserDTO dto) {
        User user = getLoggedInUser();

        user.setUsername(dto.getUsername());

        user.setEmail(dto.getEmail());

        user.setProfilePicUrl(dto.getProfilePicUrl());

        user.setFullName(dto.getFullName());

        user.setSummary(dto.getSummary());

        User savedUser = userRepository.save(user);

        return UserMapper.toDTO(savedUser);
    }

    @Override
    public UserDTO currentUser() {
        User user = getLoggedInUser();

        return UserDTO.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .username(user.getUsername())
                .summary(user.getSummary())
                .profileCompleted(user.isProfileCompleted())
                .profilePicUrl(user.getProfilePicUrl())
                .build();
    }

    @Override
    public boolean calculateProfileCompleted() {
        User user = getLoggedInUser();

        boolean completeProfile = !user.getSkills().isEmpty() && !user.getProjects().isEmpty() && !user.getEducations().isEmpty() && (!user.getWorkExperiences().isEmpty() || user.isFresher());

        user.setProfileCompleted(completeProfile);

        userRepository.save(user);

        return getLoggedInUser().isProfileCompleted();
    }

    @Override
    public Resource getProfilePic() throws IOException {
        User user = getLoggedInUser();
        Path profilePath = user.getProfilePicUrl() != null
                ? Paths.get(System.getProperty("user.home"), "resumai", user.getProfilePicUrl().replace("/uploads/", "uploads/"))
                : defaultProfilePic;

        System.out.println("Profile path " + profilePath);

        // If file doesn't exist, use default
        if (!Files.exists(profilePath) || !Files.isReadable(profilePath)) {
            profilePath = defaultProfilePic;
        }
        System.out.println("UrlResource(profilePath.toUri()) " + new UrlResource(profilePath.toUri()));
        return new UrlResource(profilePath.toUri());
    }
}
