package com.MikeCom.SystheseP.config.excepetion;

import org.springframework.http.HttpStatus;

public class InvalidJwtTokenException extends RuntimeException {
    public InvalidJwtTokenException(HttpStatus status, String message) {
        super();
    }
}