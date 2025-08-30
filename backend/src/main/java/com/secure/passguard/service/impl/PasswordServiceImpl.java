package com.secure.passguard.service.impl;

import com.secure.passguard.exception.InvalidOperationException;
import com.secure.passguard.exception.PasswordNotFoundException;
import com.secure.passguard.exception.UnauthorizedPasswordAccessException;
import com.secure.passguard.model.Password;
import com.secure.passguard.model.dto.PasswordDto;
import com.secure.passguard.model.dto.UpdatePasswordDto;
import com.secure.passguard.repository.PasswordRepository;
import com.secure.passguard.service.AuditLogService;
import com.secure.passguard.service.EncryptionService;
import com.secure.passguard.service.PasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PasswordServiceImpl implements PasswordService {

    private final PasswordRepository passwordRepository;

    private final EncryptionService encryptionService;
    private final AuditLogService auditLogService;

    @Override
    public Password createPassword(String ownerUsername, PasswordDto dto) {
        String encryptedPassword = encryptionService.encrypt(dto.getPassword());

        Password password = new Password();
        password.setOwnerUsername(ownerUsername);

        password.setTitle(dto.getTitle());
        password.setUrl(dto.getUrl());
        password.setUsername(dto.getUsername());
        password.setPassword(encryptedPassword);

        Password savedPassword = passwordRepository.save(password);
        auditLogService.logPasswordCreation(ownerUsername, password.getId());

        return savedPassword;
    }

    @Override
    public Password updatePassword(String ownerUsername, Long passwordId, UpdatePasswordDto dto) {
        Password password = passwordRepository.findById(passwordId)
            .orElseThrow(() -> new PasswordNotFoundException("Password not found with ID: " + passwordId));

        if (!password.getOwnerUsername().equals(ownerUsername)) {
            throw new UnauthorizedPasswordAccessException("You are not authorized to update this password.");
        }

        if (dto.getTitle() == null || dto.getTitle().isBlank() ||
            dto.getUsername() == null || dto.getUsername().isBlank() ||
            dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new InvalidOperationException(
                "You cannot update the password entry. Title, username, and password are required.");
        }

        password.setTitle(dto.getTitle());
        password.setUrl(dto.getUrl());
        password.setUsername(dto.getUsername());

        String encryptedPassword = encryptionService.encrypt(dto.getPassword());

        password.setPassword(encryptedPassword);

        Password updatedPassword = passwordRepository.save(password);
        auditLogService.logPasswordUpdate(ownerUsername, passwordId);

        return updatedPassword;
    }

    @Override
    public void deletePassword(String ownerUsername, Long passwordId) {
        Password password = passwordRepository.findById(passwordId)
            .orElseThrow(() -> new PasswordNotFoundException("Password not found with ID: " + passwordId));

        passwordRepository.delete(password);
        auditLogService.logPasswordDeletion(ownerUsername, passwordId);
    }

    @Override
    public List<Password> getPasswordsForUser(String ownerUsername) {
        List<Password> passwords = passwordRepository.findByOwnerUsername(ownerUsername);

        return passwords.stream()
            .peek(p -> p.setPassword(encryptionService.decrypt(p.getPassword())))
            .collect(Collectors.toList());
    }

    @Override
    public Password getPasswordById(Long passwordId) {
        return passwordRepository.findById(passwordId).orElseThrow(() ->
            new PasswordNotFoundException("Password not found with ID: " + passwordId));
    }
}
