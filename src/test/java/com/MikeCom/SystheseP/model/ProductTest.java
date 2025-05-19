package com.MikeCom.SystheseP.model;

import com.MikeCom.SystheseP.model.Enum.Brand;
import com.MikeCom.SystheseP.model.Enum.Category;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    @Test
    void getIdAndSetId() {
        Product product = new Product();
        product.setId(10L);
        assertEquals(10L, product.getId());
    }

    @Test
    void getNameAndSetName() {
        Product product = new Product();
        product.setName("Collier pour chat");
        assertEquals("Collier pour chat", product.getName());
    }

    @Test
    void getDescriptionAndSetDescription() {
        Product product = new Product();
        product.setDescription("Un joli collier rouge pour chat.");
        assertEquals("Un joli collier rouge pour chat.", product.getDescription());
    }

    @Test
    void getCategoryAndSetCategory() {
        Product product = new Product();
        product.setCategory(Category.CHIEN);
        assertEquals(Category.CHIEN, product.getCategory());
    }

    @Test
    void getPriceAndSetPrice() {
        Product product = new Product();
        product.setPrice(29.99);
        assertEquals(29.99, product.getPrice());
    }

    @Test
    void getQuantityAndSetQuantity() {
        Product product = new Product();
        product.setQuantity(5);
        assertEquals(5, product.getQuantity());
    }

    @Test
    void getImageAndSetImage() {
        Product product = new Product();
        byte[] image = {1, 2, 3};
        product.setImage(image);
        assertArrayEquals(image, product.getImage());
    }

    @Test
    void getBrandAndSetBrand() {
        Product product = new Product();
        product.setBrand(Brand.ACANA);
        assertEquals(Brand.ACANA, product.getBrand());
    }

    @Test
    void getWeightAndSetWeight() {
        Product product = new Product();
        product.setWeight(0.75);
        assertEquals(0.75, product.getWeight());
    }
}
