package com.resumeai.model;

import com.resumeai.model.superclass.Auditable;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.io.File;
import java.time.LocalDateTime;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User extends Auditable {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true)
    public String username;

    @Column(unique = true, nullable = false)
    public String email;

    private String password; // nullable if oAuth only

    // one user has many resume
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resume> resumes = new ArrayList<>();

    @Column(name = "is_profile_complete")
    private boolean isAuthProfileComplete = false;

    private String profilePicUrl;  // store image path instead of File
}
