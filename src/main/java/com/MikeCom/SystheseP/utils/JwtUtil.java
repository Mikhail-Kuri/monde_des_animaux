package com.MikeCom.SystheseP.utils;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

public class JwtUtil {

    public static SecretKey getSecretKey() {
        return Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
}
