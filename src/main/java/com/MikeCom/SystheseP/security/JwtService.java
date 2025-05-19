package com.MikeCom.SystheseP.security;

import com.MikeCom.SystheseP.config.excepetion.InvalidJwtTokenException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(Map.of(), userDetails);
    }

    public String generateToken(Map<String, Objects> claims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 heures d'expiration
                .signWith(secretKey, SignatureAlgorithm.HS256) // Utilisation de la clé secrète générée
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

//    public void validateToken(String token){
//        try{
//            Jwts.parserBuilder()
//                    .setSigningKey(secretKey) // Passez directement la clé secrète
//                    .build()
//                    .parseClaimsJws(token);
//        }catch(SecurityException ex){
//            throw new InvalidJwtTokenException(HttpStatus.BAD_REQUEST, "Invalid JWT signature");
//        }catch(MalformedJwtException ex){
//            throw new InvalidJwtTokenException(HttpStatus.BAD_REQUEST, "Invalid JWT token");
//        }catch(ExpiredJwtException ex){
//            throw new InvalidJwtTokenException(HttpStatus.BAD_REQUEST, "Expired JWT token");
//        }catch(UnsupportedJwtException ex){
//            throw new InvalidJwtTokenException(HttpStatus.BAD_REQUEST, "Unsupported JWT token");
//        }catch(IllegalArgumentException ex){
//            throw new InvalidJwtTokenException(HttpStatus.BAD_REQUEST, "JWT claims string is empty");
//        }
//    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey) // Utiliser la clé secrète pour décoder le token
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Renvoie la clé secrète utilisée pour la signature
    private Key getSingningKey() {
        return secretKey; // Retourner directement la clé secrète générée
    }
}
