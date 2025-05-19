package com.MikeCom.SystheseP.security;

import com.MikeCom.SystheseP.security.dto.AuthenticationRequest;
import com.MikeCom.SystheseP.security.dto.AuthenticationResponse;
import com.MikeCom.SystheseP.security.dto.RegisterRequest;
import com.MikeCom.SystheseP.model.Role;
import com.MikeCom.SystheseP.model.User;
import com.MikeCom.SystheseP.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }
    public AuthenticationResponse register(RegisterRequest registerRequest) {
        try {
            // Vérifier si un utilisateur avec cet email ou numéro de téléphone existe déjà
            if (userRepository.existsByEmail(registerRequest.getEmail())
                    || userRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
                throw new IllegalArgumentException("Un utilisateur avec cet email ou numéro de téléphone existe déjà.");
            }

            var user = new User.Builder()
                    .firstName(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName())
                    .email(registerRequest.getEmail())
                    .phoneNumber(registerRequest.getPhoneNumber())
                    .address(registerRequest.getAddress())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .role(Role.USER)
                    .build();

            userRepository.save(user);

            var jwtToken = jwtService.generateToken(user);

            return new AuthenticationResponse.Builder()
                    .token(jwtToken)
                    .build();

        } catch (IllegalArgumentException e) {
            return new AuthenticationResponse.Builder()
                    .errorMessage(e.getMessage())
                    .build();
        } catch (Exception e) {
            return new AuthenticationResponse.Builder()
                    .errorMessage("Une erreur est survenue lors de l'inscription.")
                    .build();
        }
    }


    public AuthenticationResponse authenticate(AuthenticationRequest registerRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword())
        );
        var user = userRepository.findByEmail(registerRequest.getEmail()).orElseThrow();

        var jwtToken = jwtService.generateToken(user);

        return new AuthenticationResponse.Builder()
                .token(jwtToken)
                .build();

    }
}
