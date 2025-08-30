package com.secure.passguard.service;

import com.secure.passguard.model.Role;
import com.secure.passguard.model.User;
import com.secure.passguard.model.dto.UserDto;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();

    UserDto getUserById(Long id);

    void updateUserRole(Long userId, String roleName);

    User findByUsername(String username);

    List<Role> getAllRoles();

    void updateAccountEnabledStatus(Long userId, boolean enabled);

    void updatePassword(Long userId, String password);

    void generatePasswordResetToken(String email);

    void resetPassword(String token, String newPassword);

    GoogleAuthenticatorKey generate2FASecret(Long userId);

    boolean validate2FACode(Long userId, int code);

    void enable2FA(Long userId);

    void disable2FA(Long userId);
}
