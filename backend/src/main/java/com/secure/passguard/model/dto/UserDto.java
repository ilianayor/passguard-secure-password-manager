package com.secure.passguard.model.dto;

import com.secure.passguard.model.Role;
import com.secure.passguard.model.SignUpMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long userId;
    private String username;
    private String email;
    private boolean enabled;
    private String twoFactorSecret;
    private boolean isTwoFactorEnabled;
    private SignUpMethod signUpMethod;
    private Role role;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
