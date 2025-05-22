package com.secure.passguard.controller;

import com.secure.passguard.model.Password;
import com.secure.passguard.model.dto.PasswordDto;
import com.secure.passguard.service.PasswordService;
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

import java.util.List;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {
    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    @PostMapping
    public Password createPassword(@RequestBody PasswordDto dto,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();

        return passwordService.createPasswordForUser(ownerUsername, dto);

    }

    @GetMapping
    public List<Password> getUserPasswords(@AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();

        return passwordService.getPasswordsForUser(ownerUsername);
    }

    @PutMapping("/{passwordId}")
    Password updatePassword(@PathVariable Long passwordId, @RequestBody String password,
                            @AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();
        return passwordService.updatePasswordForUser(ownerUsername, passwordId, password);
    }

    @DeleteMapping("/{passwordId}")
    void deletePassword(@PathVariable Long passwordId, @AuthenticationPrincipal UserDetails userDetails) {
        String ownerUsername = userDetails.getUsername();
        passwordService.deletePasswordForUser(ownerUsername, passwordId);
    }

}
