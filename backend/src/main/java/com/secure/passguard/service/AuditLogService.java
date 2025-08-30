package com.secure.passguard.service;

import com.secure.passguard.model.AuditLog;

import java.util.List;

public interface AuditLogService {
    void logPasswordCreation(String username, Long passwordId);

    void logPasswordUpdate(String username, Long passwordId);

    void logPasswordDeletion(String username, Long passwordId);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForPasswordId(Long passwordId);
}
