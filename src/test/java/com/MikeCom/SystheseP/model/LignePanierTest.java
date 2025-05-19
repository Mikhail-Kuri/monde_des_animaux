package com.MikeCom.SystheseP.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LignePanierTest {

    @Test
    void testGetSetId() {
        LignePanier ligne = new LignePanier();
        ligne.setId(10L);
        assertEquals(10L, ligne.getId());
    }

    @Test
    void testGetSetProduct() {
        LignePanier ligne = new LignePanier();
        Product product = new Product();
        product.setName("Collier élégant");
        ligne.setProduct(product);
        assertEquals(product, ligne.getProduct());
        assertEquals("Collier élégant", ligne.getProduct().getName());
    }

    @Test
    void testGetSetQuantity() {
        LignePanier ligne = new LignePanier();
        ligne.setQuantity(5);
        assertEquals(5, ligne.getQuantity());
    }

    @Test
    void testGetSetPanier() {
        LignePanier ligne = new LignePanier();
        Panier panier = new Panier();
        panier.setId(123L);
        ligne.setPanier(panier);
        assertEquals(panier, ligne.getPanier());
        assertEquals(123L, ligne.getPanier().getId());
    }
}
