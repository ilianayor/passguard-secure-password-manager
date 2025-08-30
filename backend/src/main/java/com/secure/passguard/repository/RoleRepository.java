package com.secure.passguard.repository;

import com.secure.passguard.model.AppRole;
import com.secure.passguard.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(AppRole appRole);
}
