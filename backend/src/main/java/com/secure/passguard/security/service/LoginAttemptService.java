package com.secure.passguard.security.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class LoginAttemptService {
    @Value("${security.max.attempt}")
    private int maxAttempt;

    @Value("${security.lock.time.minutes}")
    private long lockTimeMinutes;

    private final Map<String, FailedLogin> attemptsCache = new ConcurrentHashMap<>();

    public void loginFailed(String username) {
        FailedLogin failed = attemptsCache.getOrDefault(username, new FailedLogin());
        failed.increment();
        attemptsCache.put(username, failed);
    }

    public void loginSucceeded(String username) {
        attemptsCache.remove(username);
    }

    public boolean isBlocked(String username) {
        FailedLogin failed = attemptsCache.get(username);

        if (failed == null) {
            return false;
        }

        if (failed.getAttempts() >= maxAttempt) {
            long elapsed = System.currentTimeMillis() - failed.getLastAttempt();
            if (elapsed < TimeUnit.MINUTES.toMillis(lockTimeMinutes)) {
                return true;
            } else {
                attemptsCache.remove(username);
                return false;
            }
        }
        return false;
    }

    private static class FailedLogin {
        private int attempts;
        private long lastAttempt;

        void increment() {
            attempts++;
            lastAttempt = System.currentTimeMillis();
        }

        int getAttempts() {
            return attempts;
        }

        long getLastAttempt() {
            return lastAttempt;
        }
    }
}
