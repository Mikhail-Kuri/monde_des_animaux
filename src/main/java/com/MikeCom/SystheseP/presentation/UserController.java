package com.MikeCom.SystheseP.presentation;

import com.MikeCom.SystheseP.model.User;

import com.MikeCom.SystheseP.service.UserService;
import com.MikeCom.SystheseP.service.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.findByEmail(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserDTO userDTO = new UserDTO(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getRole().name()
        );

        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Voici votre tableau de bord!!");
    }

    @GetMapping("/admin/productsPage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getProductPage() {
        return ResponseEntity.ok(Map.of("message", "Voici votre page de produit!"));
    }

    @GetMapping("/admin/ordersPage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getOrdersPage() {
        return ResponseEntity.ok(Map.of("message", "Voici votre page de commandes!"));
    }

    @GetMapping("/user/userProductsPage")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> getUserProductPage() {
        return ResponseEntity.ok(Map.of("message", "Voici votre page de produit!"));
    }

    @GetMapping("/user/settingsPage")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> getUserSettingsPage() {
        return ResponseEntity.ok(Map.of("message", "Voici votre page de paramètres!"));
    }

}
