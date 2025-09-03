package com.secure.passguard.repository;

import com.secure.passguard.model.Password;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PasswordRepository extends JpaRepository<Password, Long> {
    List<Password> findByOwnerUsername(String ownerUsername);
}