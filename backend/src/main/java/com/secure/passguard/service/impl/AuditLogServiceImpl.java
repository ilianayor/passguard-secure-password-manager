package com.secure.passguard.service.impl;

import com.secure.passguard.model.Action;
import com.secure.passguard.model.AuditLog;
import com.secure.passguard.repository.AuditLogRepository;
import com.secure.passguard.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    @Autowired
    AuditLogRepository auditLogRepository;
    @Override
    public void logPasswordCreation(String username, Long passwordId) {
        AuditLog log = new AuditLog();
        log.setAction(Action.CREATE);
        log.setUsername(username);
        log.setPasswordId(passwordId);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public void logPasswordUpdate(String username, Long passwordId) {
        AuditLog log = new AuditLog();
        log.setAction(Action.UPDATE);
        log.setUsername(username);
        log.setPasswordId(passwordId);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public void logPasswordDeletion(String username, Long passwordId) {
        AuditLog log = new AuditLog();
        log.setAction(Action.DELETE);
        log.setUsername(username);
        log.setPasswordId(passwordId);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    @Override
    public List<AuditLog> getAuditLogsForPasswordId(Long passwordId) {
        return auditLogRepository.findByPasswordId(passwordId);
    }

}
