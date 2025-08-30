package com.secure.passguard.repository;

import com.secure.passguard.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByPasswordId(Long passwordId);
}
