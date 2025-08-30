package com.secure.passguard.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class InvalidPasswordResetToken extends RuntimeException {
    public InvalidPasswordResetToken(String message) {
        super(message);
    }

    public InvalidPasswordResetToken(String message, Throwable cause) {
        super(message, cause);
    }
}
