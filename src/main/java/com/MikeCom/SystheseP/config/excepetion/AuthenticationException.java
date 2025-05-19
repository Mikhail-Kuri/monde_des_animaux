package com.MikeCom.SystheseP.config.excepetion;

import org.springframework.http.HttpStatus;

public class AuthenticationException extends RuntimeException {
    public AuthenticationException(HttpStatus forbidden, String message) {
        super(message);
    }
}
