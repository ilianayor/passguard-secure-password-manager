package com.secure.passguard.service.impl;

import com.secure.passguard.model.Password;
import com.secure.passguard.model.dto.PasswordDto;
import com.secure.passguard.repository.PasswordRepository;
import com.secure.passguard.service.PasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PasswordServiceImpl implements PasswordService {
    private final PasswordRepository passwordRepository;

    @Override
    public Password createPasswordForUser(String ownerUsername, PasswordDto dto) {
        Password pass = new Password();
        pass.setOwnerUsername(ownerUsername);
        pass.setTitle(dto.getTitle());
        pass.setEmail(dto.getEmail());
        pass.setPassword(dto.getPassword());

        return passwordRepository.save(pass);
    }

    @Override
    public Password updatePasswordForUser(String ownerUsername, Long passwordId, String password) {
        Password pass = passwordRepository.findById(passwordId).orElseThrow(() ->
            new RuntimeException("Password not found"));
        pass.setPassword(password);

        return passwordRepository.save(pass);
    }

    @Override
    public void deletePasswordForUser(String ownerUsername, Long passwordId) {
        Password pass = passwordRepository.findById(passwordId).orElseThrow(() ->
            new RuntimeException("Password not found"));

        passwordRepository.deleteById(passwordId);
    }

    @Override
    public List<Password> getPasswordsForUser(String ownerUsername) {
        return passwordRepository.findByOwnerUsername(ownerUsername);
    }
}
