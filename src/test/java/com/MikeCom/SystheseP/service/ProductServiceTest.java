package com.MikeCom.SystheseP.service;

import com.MikeCom.SystheseP.model.Enum.Category;
import com.MikeCom.SystheseP.model.Product;
import com.MikeCom.SystheseP.repository.ProductRepository;
import com.MikeCom.SystheseP.security.Mappers.ProductMapper;
import com.MikeCom.SystheseP.service.dto.ProductDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.mockito.MockedStatic;

class ProductServiceTest {

    private ProductRepository productRepository;
    private ProductService productService;

    @BeforeEach
    void setup() {
        productRepository = mock(ProductRepository.class);
        productService = new ProductService(productRepository);
    }


    @Test
    void testGetAllProducts() {
        // Arrange
        Product product1 = new Product();
        product1.setId(1L);
        product1.setName("Produit A");
        product1.setPrice(10.0);

        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Produit B");
        product2.setPrice(20.0);

        List<Product> productList = Arrays.asList(product1, product2);

        when(productRepository.findAll()).thenReturn(productList);

        ProductDTO dto1 = new ProductDTO();
        ProductDTO dto2 = new ProductDTO();

        // Act
        ProductDTO[] dtos = productService.getAllProducts();

        // Assert
        assertEquals(2, dtos.length);
        assertEquals("Produit A", dtos[0].getName());
        assertEquals(10.0, dtos[0].getPrice());
        assertEquals("Produit B", dtos[1].getName());
        assertEquals(20.0, dtos[1].getPrice());

        verify(productRepository, times(1)).findAll();

    }


    @Test
    void getProductById() {

        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setName("Produit A");
        product.setPrice(10.0);

        when(productRepository.findById(1)).thenReturn(java.util.Optional.of(product));

        // Act
        ProductDTO dto = productService.getProductById(1L);

        // Assert
        assertEquals("Produit A", dto.getName());
        assertEquals(10.0, dto.getPrice());

        verify(productRepository, times(1)).findById(1);
    }

    @Test
    void deleteProduct() {
        // Arrange
        Long productId = 1L;

        // Act
        productService.deleteProduct(productId);

        // Assert
        verify(productRepository, times(1)).deleteById(Math.toIntExact(productId));
    }


    @Test
    void updateProduct() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setName("Produit A");
        product.setPrice(10.0);

        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(1L);
        productDTO.setName("Produit A");
        productDTO.setPrice(10.0);

        when(productRepository.existsById(Math.toIntExact(product.getId()))).thenReturn(true);
        when(productRepository.save(any(Product.class))).thenReturn(product); // ne pas appeler toEntity directement ici

        try (MockedStatic<ProductMapper> mockedMapper = mockStatic(ProductMapper.class)) {
            // Mock des méthodes statiques
            mockedMapper.when(() -> ProductMapper.toEntity(any(ProductDTO.class))).thenReturn(product);
            mockedMapper.when(() -> ProductMapper.toDTO(any(Product.class))).thenReturn(productDTO);

            // Act
            ProductDTO updatedProduct = productService.updateProduct(1L, productDTO);

            // Assert
            assertEquals("Produit A", updatedProduct.getName());
            assertEquals(10.0, updatedProduct.getPrice());

            verify(productRepository, times(1)).existsById(1);
            verify(productRepository, times(1)).save(any(Product.class));
        }
    }


    @Test
    void createProduct() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setName("Produit A");
        product.setPrice(10.0);

        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(1L);
        productDTO.setName("Produit A");
        productDTO.setPrice(10.0);

        try (MockedStatic<ProductMapper> mockedMapper = mockStatic(ProductMapper.class)) {
            // Mock des méthodes statiques
            mockedMapper.when(() -> ProductMapper.toEntity(productDTO)).thenReturn(product);
            mockedMapper.when(() -> ProductMapper.toDTO(product)).thenReturn(productDTO);

            when(productRepository.save(product)).thenReturn(product);

            // Act
            ProductDTO createdProduct = productService.createProduct(productDTO);

            // Assert
            assertEquals("Produit A", createdProduct.getName());
            assertEquals(10.0, createdProduct.getPrice());

            verify(productRepository, times(1)).save(product);
        }
    }

}