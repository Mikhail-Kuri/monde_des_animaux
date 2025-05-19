package com.MikeCom.SystheseP.presentation;

import com.MikeCom.SystheseP.service.AdminService;
import com.MikeCom.SystheseP.service.dto.AdminCommandeDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/all/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminCommandeDto>> getAllCommandes() {
        try {
            return ResponseEntity.ok(adminService.getAllCommandes());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
