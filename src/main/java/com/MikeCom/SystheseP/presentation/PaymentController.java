package com.MikeCom.SystheseP.presentation;

import com.MikeCom.SystheseP.model.Commande;
import com.MikeCom.SystheseP.model.PaymentRequest;
import com.MikeCom.SystheseP.security.JwtService;
import com.MikeCom.SystheseP.service.UserService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")

public class PaymentController {

    private UserService userService;

    private final JwtService jwtService;

    @Value("${stripe.api.key}")
    private String stripeApiKey;


    public PaymentController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
//    @RequestBody PaymentRequest paymentRequest
    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {

        Stripe.apiKey = stripeApiKey; // Initialise la clé API Stripe
        // Crée un PaymentIntent sur Stripe avec le total à payer
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(paymentRequest.getTotal()) // Montant en cents
                .setCurrency("cad")  // ou ta devise
                .build();

        try {
            PaymentIntent intent = PaymentIntent.create(params);
            Commande commande = userService.upDateCommandeWithPanierId(paymentRequest);
            userService.savePayment(commande);
            // Renvoyer le clientSecret à l'application frontend
            return ResponseEntity.ok(Map.of("clientSecret", intent.getClientSecret()));
        } catch (StripeException e) {
            // En cas d'erreur, retourner une réponse avec un message d'erreur
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }




    private String extractUsernameFromAuthHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        return jwtService.extractUserName(token);
    }
}
