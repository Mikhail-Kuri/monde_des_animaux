package com.MikeCom.SystheseP.presentation;

import com.MikeCom.SystheseP.model.LignePanier;
import com.MikeCom.SystheseP.model.Panier;
import com.MikeCom.SystheseP.model.Product;
import com.MikeCom.SystheseP.security.JwtService;
import com.MikeCom.SystheseP.security.Mappers.LignePanierMapper;
import com.MikeCom.SystheseP.security.Mappers.ProductMapper;
import com.MikeCom.SystheseP.security.dto.AddToCartRequest;
import com.MikeCom.SystheseP.service.UserService;
import com.MikeCom.SystheseP.service.dto.AdminProductCommandeDto;
import com.MikeCom.SystheseP.service.dto.LignePanierDto;
import com.MikeCom.SystheseP.service.dto.ProductDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.MikeCom.SystheseP.service.dto.PanierDto;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final UserService userService;

    private final JwtService jwtService;

    public CartController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> getPanier(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "").trim();
            String username = jwtService.extractUserName(token);
            System.out.println("Récupération du panier pour l'utilisateur : " + username);

            PanierDto panier = userService.getPanierPourUtilisateur(username);

            return ResponseEntity.ok(panier);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non trouvé");
        } catch (RuntimeException e) {
            System.out.println("Erreureeeeeeeeeeeeeeeeeeeeeeeee : " + e.getMessage());
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLinePanierByPanierId(@PathVariable Long id) {
        try {
            List<LignePanier> lignePaniers = userService.getLignePanierByPanierId(id);
            if (lignePaniers == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ligne de panier non trouvée");
            }
            List<LignePanierDto> lignePanierDtos = lignePaniers.stream()
                    .map(LignePanierMapper::toDto)
                    .toList();
            return ResponseEntity.ok(lignePanierDtos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    @GetMapping("/commande/{id}")
    public ResponseEntity<?> getProductsByCommandeID(@PathVariable Long id) {
        try {
            List<AdminProductCommandeDto> products = userService.getLignePanierByCommandeId(id);

            if (products == null || products.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ligne de panier non trouvée");
            }

            return ResponseEntity.ok(products);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }


    @PostMapping("/add")
    public ResponseEntity<?> ajouterAuPanier(@RequestBody AddToCartRequest request,
                                             @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "").trim();
            String username = jwtService.extractUserName(token);

            LignePanierDto ligneAjoutee = userService.ajouterAuPanier(username, request);
            return ResponseEntity.ok(ligneAjoutee);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non trouvé");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }


}



