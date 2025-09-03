package com.secure.passguard.service;

import com.secure.passguard.model.Password;
import com.secure.passguard.model.dto.PasswordDto;
import com.secure.passguard.model.dto.UpdatePasswordDto;

import java.util.List;

public interface PasswordService {

    Password createPassword(String ownerUsername, PasswordDto dto);

    Password updatePassword(String ownerUsername, Long passwordId, UpdatePasswordDto dto);

    void deletePassword(String ownerUsername, Long passwordId);

    List<Password> getPasswordsForUser(String ownerUsername);

    Password getPasswordById(Long passwordId);
}