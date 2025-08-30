package com.secure.passguard.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class ErrorResponse {
    private final String status;
    private final String message;
    private final String timestamp;
}
