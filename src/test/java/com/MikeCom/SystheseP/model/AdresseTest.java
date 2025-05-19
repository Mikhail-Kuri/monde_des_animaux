package com.MikeCom.SystheseP.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AdresseTest {

    @Test
    void testSetAndGetId() {
        Adresse adresse = new Adresse();
        adresse.setId(1L);
        assertEquals(1L, adresse.getId());
    }

    @Test
    void testSetAndGetAdresse() {
        Adresse adresse = new Adresse();
        adresse.setAdresse("123 rue des Lilas");
        assertEquals("123 rue des Lilas", adresse.getAdresse());
    }

    @Test
    void testSetAndGetCodePostal() {
        Adresse adresse = new Adresse();
        adresse.setCodePostal("H1H1H1");
        assertEquals("H1H1H1", adresse.getCodePostal());
    }

    @Test
    void testSetAndGetVille() {
        Adresse adresse = new Adresse();
        adresse.setVille("Montréal");
        assertEquals("Montréal", adresse.getVille());
    }

    @Test
    void testSetAndGetUserId() {
        Adresse adresse = new Adresse();
        adresse.setUserId(5L);
        assertEquals(5L, adresse.getUserId());
    }

    @Test
    void testConstructorWithFields() {
        Adresse adresse = new Adresse("456 Avenue", "J2K3L4", "Québec");
        assertEquals("456 Avenue", adresse.getAdresse());
        assertEquals("J2K3L4", adresse.getCodePostal());
        assertEquals("Québec", adresse.getVille());
    }

    @Test
    void testCopyConstructor() {
        Adresse original = new Adresse("789 Boulevard", "G1X2Y3", "Laval");
        Adresse copie = new Adresse(original);
        assertEquals(original.getAdresse(), copie.getAdresse());
        assertEquals(original.getCodePostal(), copie.getCodePostal());
        assertEquals(original.getVille(), copie.getVille());
    }
}
