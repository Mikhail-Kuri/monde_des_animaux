package com.MikeCom.SystheseP.security.Mappers;

import com.MikeCom.SystheseP.model.LignePanier;
import com.MikeCom.SystheseP.model.Panier;
import com.MikeCom.SystheseP.service.dto.LignePanierDto;
import com.MikeCom.SystheseP.service.dto.PanierDto;


import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

public class PanierMapper {

    public static PanierDto toDto(Panier panier) {
        List<LignePanierDto> ligneDtos = panier.getLignePaniers().stream()
                .map(lp -> {
                    var product = lp.getProduct();

                    return new LignePanierDto(
                            lp.getId(),
                            product.getId(),
                            product.getName(),
                            lp.getQuantity(),
                            product.getPrice()

                    );
                })
                .collect(Collectors.toList());

        return new PanierDto(
                ligneDtos,
                panier.getId()
        );
    }
}
