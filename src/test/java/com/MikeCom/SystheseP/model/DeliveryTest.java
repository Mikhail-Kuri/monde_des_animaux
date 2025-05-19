package com.MikeCom.SystheseP.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

class DeliveryTest {

    @Test
    void testGetSetId() {
        Delivery delivery = new Delivery();
        delivery.setId(1L);
        assertEquals(1L, delivery.getId());
    }

    @Test
    void testGetSetDateRetrait() {
        Delivery delivery = new Delivery();
        LocalDate date = LocalDate.of(2025, 4, 25);
        delivery.setDateRetrait(date);
        assertEquals(date, delivery.getDateRetrait());
    }

    @Test
    void testGetSetHeureRetrait() {
        Delivery delivery = new Delivery();
        LocalTime time = LocalTime.of(14, 30);
        delivery.setHeureRetrait(time);
        assertEquals(time, delivery.getHeureRetrait());
    }

    @Test
    void testGetSetAdresse() {
        Delivery delivery = new Delivery();
        Adresse adresse = new Adresse("123 rue Test", "H2X3X3", "Montréal");
        delivery.setAdresse(adresse);
        assertEquals(adresse, delivery.getAdresse());
    }

    @Test
    void testGetSetCommande() {
        Delivery delivery = new Delivery();
        Commande commande = new Commande();
        delivery.setCommande(commande);
        assertEquals(commande, delivery.getCommande());
    }

    @Test
    void testGetSetPhone() {
        Delivery delivery = new Delivery();
        delivery.setPhone("5141234567");
        assertEquals("5141234567", delivery.getPhone());
    }

    @Test
    void testGetSetNote() {
        Delivery delivery = new Delivery();
        delivery.setNote("Laisser à la porte.");
        assertEquals("Laisser à la porte.", delivery.getNote());
    }
}
