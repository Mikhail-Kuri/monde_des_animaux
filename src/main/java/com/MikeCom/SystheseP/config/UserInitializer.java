package com.MikeCom.SystheseP.config;

import com.MikeCom.SystheseP.model.Role;
import com.MikeCom.SystheseP.model.User;
import com.MikeCom.SystheseP.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UserInitializer {

    @Bean
    public ApplicationRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("user@example.com").isEmpty()) {
                User user = new User.Builder()
                        .firstName("Regular")
                        .lastName("User")
                        .email("user@test.com")
                        .phoneNumber("0987654321")
                        .address("User Address")
                        .password(passwordEncoder.encode("user123"))
                        .role(Role.USER)
                        .build();
                userRepository.save(user);
                System.out.println("User account created!");
            } else {
                System.out.println("User account already exists!");
            }
        };
    }
}




