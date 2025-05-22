package com.secure.passguard.service;

import com.secure.passguard.model.Password;
import com.secure.passguard.model.dto.PasswordDto;

import java.util.List;

public interface PasswordService {

    Password createPasswordForUser(String ownerUsername, PasswordDto dto);

    Password updatePasswordForUser(String ownerUsername, Long passwordId, String password);

    void deletePasswordForUser(String ownerUsername, Long passwordId);

    List<Password> getPasswordsForUser(String ownerUsername);
}
