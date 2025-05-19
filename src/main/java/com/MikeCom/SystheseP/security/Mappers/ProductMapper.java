package com.MikeCom.SystheseP.security.Mappers;

import com.MikeCom.SystheseP.model.Product;
import com.MikeCom.SystheseP.service.dto.ProductDTO;

import java.util.Base64;

public class ProductMapper {

    public static ProductDTO toDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getCategory(),
                product.getPrice(),
                product.getQuantity(),
                product.getImage() != null ? Base64.getEncoder().encodeToString(product.getImage()) : null,
                product.getBrand(),
                product.getWeight()
        );
    }

    public static Product toEntity(ProductDTO dto) {
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setImage(dto.getImageBase64() != null ? Base64.getDecoder().decode(dto.getImageBase64()) : null);
        product.setBrand(dto.getBrand());
        product.setWeight(dto.getWeight());
        return product;
    }
}
