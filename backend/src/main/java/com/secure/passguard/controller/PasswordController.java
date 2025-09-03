package com.secure.passguard.controller;

import com.secure.passguard.exception.InvalidOperationException;
import com.secure.passguard.exception.UnauthorizedPasswordAccessException;
import com.secure.passguard.model.Password;
import com.secure.passguard.model.dto.PasswordDto;
import com.secure.passguard.model.dto.UpdatePasswordDto;
import com.secure.passguard.service.EncryptionService;
import com.secure.passguard.service.PasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {
    private final PasswordService passwordService;
    private final EncryptionService encryptionService;

    public PasswordController(PasswordService passwordService, EncryptionService encryptionService) {
        this.passwordService = passwordService;
        this.encryptionService = encryptionService;
    }

    @PostMapping
    public Password createPassword(@RequestBody PasswordDto dto,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();
        return passwordService.createPassword(ownerUsername, dto);
    }

    @GetMapping("/{passwordId}")
    public PasswordDto getPasswordById(@PathVariable Long passwordId,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();

        Password password = passwordService.getPasswordById(passwordId);

        if (password == null || !password.getOwnerUsername().equals(ownerUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this password");
        }

        String decryptedPassword = encryptionService.decrypt(password.getPassword());

        return new PasswordDto(
            password.getTitle(),
            password.getUrl(),
            password.getUsername(),
            decryptedPassword
        );
    }

    @GetMapping
    public List<Password> getUserPasswords(@AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();
        return passwordService.getPasswordsForUser(ownerUsername);
    }

    @PutMapping("/{passwordId}")
    public Password updatePassword(@PathVariable Long passwordId,
                                   @RequestBody UpdatePasswordDto dto,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();
        return passwordService.updatePassword(ownerUsername, passwordId, dto);
    }

    @DeleteMapping("/{passwordId}")
    public void deletePassword(@PathVariable Long passwordId,
                               @AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();
        passwordService.deletePassword(ownerUsername, passwordId);
    }

    @GetMapping("/decrypted")
    public List<PasswordDto> getUserPasswordsDecrypted(@AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();
        List<Password> encryptedPasswords = passwordService.getPasswordsForUser(ownerUsername);

        return encryptedPasswords.stream()
            .map(entry -> {
                String decryptedPassword = encryptionService.decrypt(entry.getPassword());

                return new PasswordDto(entry.getTitle(), entry.getUrl(), entry.getUsername(),
                    decryptedPassword);
            })
            .collect(Collectors.toList());
    }

    @GetMapping("/decrypt/{passwordId}")
    public String getDecryptedPasswordById(@PathVariable Long passwordId,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();
        Password entry = passwordService.getPasswordById(passwordId);

        if (!entry.getOwnerUsername().equals(ownerUsername)) {
            throw new UnauthorizedPasswordAccessException("You are not authorized to view this password.");
        }

        return encryptionService.decrypt(entry.getPassword());
    }

}