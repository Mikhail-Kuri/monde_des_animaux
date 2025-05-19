package com.MikeCom.SystheseP.presentation;

import com.MikeCom.SystheseP.model.Commande;
import com.MikeCom.SystheseP.model.Enum.OrderStatus;
import com.MikeCom.SystheseP.security.JwtService;
import com.MikeCom.SystheseP.service.UserService;
import com.MikeCom.SystheseP.service.dto.CommandeResponseDTO;
import com.MikeCom.SystheseP.service.dto.DeliveryCommandeDTO;
import com.MikeCom.SystheseP.service.dto.PickUpCommandeDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/commande")
public class CommandeController {


    private UserService userService;

    private final JwtService jwtService;

    public CommandeController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/pick_up")
    public ResponseEntity<?> createCommandePickUp(@RequestBody PickUpCommandeDTO dto) {
        try {
            Commande commande = userService.createCommandePickUp(dto);
            CommandeResponseDTO response = new CommandeResponseDTO(
                    commande.getId(),
                    commande.getConfirmationCode(),
                    "Commande enregistrée avec succès !"
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    @PostMapping("/delivery")
    public ResponseEntity<?> createCommandeDelivery(@RequestBody DeliveryCommandeDTO dto) {
        System.out.println("Création d'une commande de livraison : " + dto);
        try {
            Commande commande = userService.createCommandeDelivery(dto);
            CommandeResponseDTO response = new CommandeResponseDTO(
                    commande.getId(),
                    commande.getConfirmationCode(),
                    "Commande enregistrée avec succès !"
            );
            System.out.println("Commande créée avec succès : " + response);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    @GetMapping("/client")
    public ResponseEntity<?> getPickUpCommandesPourClient(@RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuthHeader(authHeader);
            System.out.println("Récupération des commandes Pick-Up pour l'utilisateur : " + username);

            List<?> commandes = userService.findPickUpCommandesByClientEmail(username);
            return ResponseEntity.ok(commandes);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non trouvé");
        } catch (RuntimeException e) {
            System.out.println("❌ Erreur : " + e.getMessage());
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }



    @GetMapping("/payments")
    public ResponseEntity<?> getPaymentOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuthHeader(authHeader);
            System.out.println("🔍 Récupération des commandes de paiement pour l'utilisateur : " + username);

            List<PickUpCommandeDTO> commandesPickUp = userService.findPaymentOrdersByClientEmail(username);
            List<DeliveryCommandeDTO> commandesDelivery = userService.findDeliveryOrdersByClientEmail(username);

            boolean hasPickUp = commandesPickUp != null && !commandesPickUp.isEmpty();
            boolean hasDelivery = commandesDelivery != null && !commandesDelivery.isEmpty();

            if (!hasPickUp && !hasDelivery) {
                return ResponseEntity.ok(Map.of(
                        "message", "Aucune commande de paiement trouvée",
                        "pickUp", List.of(),
                        "delivery", List.of()
                ));
            }

            return ResponseEntity.ok(Map.of(
                    "pickUp", hasPickUp ? commandesPickUp : List.of(),
                    "delivery", hasDelivery ? commandesDelivery : List.of()
            ));

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Utilisateur non trouvé"
            ));
        } catch (RuntimeException e) {
            System.out.println("❌ Erreur : " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Erreur : " + e.getMessage()
            ));
        }
    }

    @PutMapping("/updateStatus/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCommande(@PathVariable Long id, @RequestBody String status) {
        try {
            String updatedCommandeMsg = userService.updateCommandeStatus(id, status);
            return ResponseEntity.ok(updatedCommandeMsg);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }


    private String extractUsernameFromAuthHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        return jwtService.extractUserName(token);
    }

}
