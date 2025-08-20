package com.resumeai.service;

import com.resumeai.dto.UserDTO;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;


public interface UserProfileService {
    public UserDTO getUserDTO(UUID id);

    public UserDTO updateUser(UUID id, UserDTO dto);

    UserDTO currentUser();

    boolean calculateProfileCompleted();

    Resource getProfilePic() throws IOException;
}
