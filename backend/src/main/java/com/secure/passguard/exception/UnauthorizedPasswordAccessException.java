package com.secure.passguard.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class UnauthorizedPasswordAccessException extends RuntimeException {
    public UnauthorizedPasswordAccessException(String message) {
        super(message);
    }

    public UnauthorizedPasswordAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
