package com.MikeCom.SystheseP.security;

import jakarta.servlet.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Autowired
    public SecurityConfiguration(JwtAuthenticationFilter jwtAuthFilter,  AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/v1/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/demo/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/user/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/product/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/product/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/product/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/product/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/cart/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/cart/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/commande/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/commande/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/commande/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/payment/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/admin/**").authenticated()
                        .requestMatchers("/api/v1/user/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/user/user/**").hasRole("USER")
                        .requestMatchers("/api/v1/product/create").hasRole("ADMIN")
                        .requestMatchers("/api/v1/product/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/v1/cart/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/v1/commande/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/v1/admin/**").hasAnyRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .headers(headers -> headers.frameOptions(Customizer.withDefaults()).disable())
                .sessionManagement(secuManagement -> secuManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterAfter(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

