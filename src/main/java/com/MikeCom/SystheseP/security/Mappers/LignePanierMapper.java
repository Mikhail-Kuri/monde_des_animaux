package com.MikeCom.SystheseP.security.Mappers;

import com.MikeCom.SystheseP.model.LignePanier;
import com.MikeCom.SystheseP.model.Product;
import com.MikeCom.SystheseP.service.dto.LignePanierDto;

public class LignePanierMapper {

    public static LignePanierDto toDto(LignePanier lignePanier) {
        return new LignePanierDto(
                lignePanier.getId(),
                lignePanier.getProduct().getId(),
                lignePanier.getProduct().getName(),
                lignePanier.getQuantity(),
                lignePanier.getProduct().getPrice()
        );
    }
}
