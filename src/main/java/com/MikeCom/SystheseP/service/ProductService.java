package com.MikeCom.SystheseP.service;

import com.MikeCom.SystheseP.repository.ProductRepository;
import com.MikeCom.SystheseP.repository.UserRepository;
import com.MikeCom.SystheseP.security.Mappers.ProductMapper;
import com.MikeCom.SystheseP.service.dto.ProductDTO;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductDTO[] getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toDTO)
                .toArray(ProductDTO[]::new);
    }

    public ProductDTO getProductById(Long id) {
        return productRepository.findById(Math.toIntExact(id))
                .map(ProductMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(Math.toIntExact(id));
    }


    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        if (productRepository.existsById(Math.toIntExact(id))) {
            productDTO.setId(id);
            return ProductMapper.toDTO(productRepository.save(ProductMapper.toEntity(productDTO)));
        } else {
            throw new RuntimeException("Produit non trouvé");
        }
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        return ProductMapper.toDTO(productRepository.save(ProductMapper.toEntity(productDTO)));
    }
}
