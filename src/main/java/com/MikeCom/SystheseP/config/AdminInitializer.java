package com.MikeCom.SystheseP.config;

import com.MikeCom.SystheseP.model.Role;
import com.MikeCom.SystheseP.model.User;
import com.MikeCom.SystheseP.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    public ApplicationRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = new User.Builder()
                        .firstName("Admin")
                        .lastName("User")
                        .email("admin@test.com")
                        .phoneNumber("1234567890")
                        .address("Admin Address")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin account created!");
            }
            else {
                System.out.println("Admin account already exists!");
            }
        };
    }
}

