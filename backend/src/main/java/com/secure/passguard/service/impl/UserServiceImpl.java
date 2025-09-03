package com.secure.passguard.service.impl;

import com.secure.passguard.exception.InvalidOperationException;
import com.secure.passguard.exception.InvalidPasswordResetToken;
import com.secure.passguard.exception.RoleNotFoundException;
import com.secure.passguard.exception.UserNotFoundException;
import com.secure.passguard.model.AppRole;
import com.secure.passguard.model.PasswordResetToken;
import com.secure.passguard.model.Role;
import com.secure.passguard.model.User;
import com.secure.passguard.model.dto.UserDto;
import com.secure.passguard.repository.PasswordResetTokenRepository;
import com.secure.passguard.repository.RoleRepository;
import com.secure.passguard.repository.UserRepository;
import com.secure.passguard.service.TotpService;
import com.secure.passguard.service.UserService;
import com.secure.passguard.util.EmailService;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    @Value("${frontend.url}")
    String frontendUrl;

    @Value("${reset.password.path}")
    private String resetPasswordPath;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final TotpService totpService;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        AppRole appRole = AppRole.valueOf(roleName);

        Role role = roleRepository.findByRoleName(appRole)
            .orElseThrow(() -> new RoleNotFoundException("Role not found with name: " + roleName));

        user.setRole(role);
        userRepository.save(user);
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return convertToDto(user);
    }

    private UserDto convertToDto(User user) {
        return new UserDto(user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.isEnabled(),
            user.getTwoFactorSecret(),
            user.isTwoFactorEnabled(),
            user.getSignUpMethod(),
            user.getRole(),
            user.getCreatedDate(),
            user.getUpdatedDate());
    }

    @Override
    public User findByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElseThrow(() -> new UserNotFoundException("User not found with this username"));
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public void updateAccountEnabledStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId).orElseThrow(()
            -> new UserNotFoundException("User not found"));

        user.setEnabled(enabled);
        userRepository.save(user);
    }

    @Override
    public void updatePassword(Long userId, String password) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        } catch (Exception e) {
            throw new InvalidOperationException("Failed to update password");
        }
    }

    @Override
    public void generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plus(24, ChronoUnit.HOURS);

        PasswordResetToken resetToken = new PasswordResetToken(token, expiryDate, user);

        passwordResetTokenRepository.save(resetToken);

        String resetUrl = frontendUrl + resetPasswordPath + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);

    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
            .orElseThrow(() -> new InvalidPasswordResetToken("Invalid password reset token"));

        if (passwordResetToken.isUsed()) {
            throw new InvalidPasswordResetToken("Password reset token has already been used");
        }

        if (passwordResetToken.getExpiryDate().isBefore(Instant.now())) {
            throw new InvalidPasswordResetToken("Password reset token has already expired");
        }

        User user = passwordResetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetToken.setUsed(true);
        passwordResetTokenRepository.save(passwordResetToken);
    }

    @Override
    public GoogleAuthenticatorKey generateMfaSecret(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        GoogleAuthenticatorKey key = totpService.generateSecret();
        user.setTwoFactorSecret(key.getKey());
        userRepository.save(user);

        return key;
    }

    @Override
    public boolean validateMfaCode(Long userId, int code) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        return totpService.verifyCode(user.getTwoFactorSecret(), code);
    }

    @Override
    public void enableMfa(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }

    @Override
    public void disableMfa(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        user.setTwoFactorEnabled(false);
        userRepository.save(user);
    }

}
