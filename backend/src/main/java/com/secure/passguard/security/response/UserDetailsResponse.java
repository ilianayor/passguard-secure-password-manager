package com.secure.passguard.security.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserDetailsResponse {
    private Long id;
    private String username;
    private String email;
    private boolean enabled;
    private boolean isTwoFactorEnabled;
    private List<String> roles;
}
