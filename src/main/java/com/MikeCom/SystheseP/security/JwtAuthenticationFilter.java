package com.MikeCom.SystheseP.security;

import com.MikeCom.SystheseP.config.ApplicationConfig;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwService, UserDetailsService userDetailsService) {
        this.jwtService = jwService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        System.out.println("Request: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa " + wrappedRequest);
        String requestBody = new String(wrappedRequest.getContentAsByteArray(), wrappedRequest.getCharacterEncoding());
        System.out.println("Request Body: " + requestBody);

        String token = getJWTFromRequest(wrappedRequest);
        System.out.println("Authorization Header: " + token);

        if (token == null || !token.startsWith("Bearer ")) {
            System.out.println("Token is null or does not start with Bearer");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = token.substring(7);

        System.out.println("JWT: " + jwt);
        final String userEmail = jwtService.extractUserName(jwt);
        System.out.println("User Email: " + userEmail);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("User Email is not null and Security Context Authentication is null");
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if (jwtService.validateToken(jwt, userDetails)) {
                System.out.println("Token is valid");
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                System.out.println(userDetails.getAuthorities());
                System.out.println("User Details: " + userDetails);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(wrappedRequest));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
        System.out.println(response.getStatus());
    }

//    @Override
//    protected void doFilterInternal(
//            @NonNull HttpServletRequest request,
//            @NonNull HttpServletResponse response,
//            @NonNull FilterChain filterChain
//    ) throws ServletException, IOException {
//
//        // Envelopper la requête dans ContentCachingRequestWrapper
//        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
//
//        // Passer la requête enveloppée au filter chain
//        filterChain.doFilter(wrappedRequest, response);
//
//        // Après le filtrage, vous pouvez lire le corps de la requête
//        String requestBody = new String(wrappedRequest.getContentAsByteArray(), wrappedRequest.getCharacterEncoding());
//        System.out.println("Request Body: " + requestBody);
//
//        // Récupérer le token depuis le headerQ
//        String token = getJWTFromRequest(wrappedRequest);
//        System.out.println("Authorization Header: " + token);
//
//        // Vérification si le header est null ou ne commence pas par "Bearer "
//        if (token == null || !token.startsWith("Bearer ")) {
//            System.out.println("Token is null or does not start with Bearer");
//            return;
//        }
//
//        // Extraire le token JWT en supprimant "Bearer "
//        final String jwt = token.substring(7);
//
//        System.out.println("JWT: " + jwt);
//        final String userEmail = jwtService.extractUserName(jwt);
//        System.out.println("User Email: " + userEmail);
//
//        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//            System.out.println("User Email is not null and Security Context Authentication is null");
//            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
//            if (jwtService.validateToken(jwt, userDetails)) {
//                System.out.println("Token is valid");
//                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                        userDetails, null, userDetails.getAuthorities()
//                );
//                System.out.println(userDetails.getAuthorities());
//                System.out.println("User Details: " + userDetails);
//                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(wrappedRequest));
//                SecurityContextHolder.getContext().setAuthentication(authToken);
//            }
//            filterChain.doFilter(request, response);
//            System.out.println(response.getStatus());
//        }
//    }


//    @Override
//    protected void doFilterInternal(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            FilterChain filterChain
//    ) throws ServletException, IOException {
//        String token = getJWTFromRequest(request);
//        if (StringUtils.hasText(token)) {
//            token = token.startsWith("Bearer") ? token.substring(7) : token;
//            try {
//                tokenProvider.validateToken(token);
//                String email = tokenProvider.getEmailFromJWT(token);
//                UserApp user = userRepository.findUserAppByEmail(email).orElseThrow(UserNotFoundException::new);
//                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
//                        user.getEmail(), null, user.getAuthorities()
//                );
//                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
//            } catch (Exception e) {
//                logger.error("Could not set user authentication in security context", e);
//            }
//        }
//        filterChain.doFilter(request, response);
//    }

    private String getJWTFromRequest(HttpServletRequest request) {
        return request.getHeader(ApplicationConfig.AUTHORIZATION_HEADER);
    }

}
