package com.MikeCom.SystheseP.model;

import com.MikeCom.SystheseP.model.Enum.ModeLivraison;
import com.MikeCom.SystheseP.model.Enum.PaymentMethod;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CommandeTest {

    @Test
    void testGetSetId() {
        Commande commande = new Commande();
        commande.setId(100L);
        assertEquals(100L, commande.getId());
    }

    @Test
    void testGetSetPanier() {
        Commande commande = new Commande();
        Panier panier = new Panier();
        commande.setPanier(panier);
        assertEquals(panier, commande.getPanier());
    }

    @Test
    void testGetSetConfirmationCode() {
        Commande commande = new Commande();
        commande.setConfirmationCode("ABC123");
        assertEquals("ABC123", commande.getConfirmationCode());
    }

    @Test
    void testGetSetModeLivraison() {
        Commande commande = new Commande();
        commande.setModeLivraison(ModeLivraison.PICKUP);
        assertEquals(ModeLivraison.PICKUP, commande.getModeLivraison());
    }

    @Test
    void testGetSetPaymentMethod() {
        Commande commande = new Commande();
        commande.setPaymentMethod(PaymentMethod.EN_LIGNE);
        assertEquals(PaymentMethod.EN_LIGNE, commande.getPaymentMethod());
    }

    @Test
    void testGetSetPickUp() {
        Commande commande = new Commande();
        PickUp pickUp = new PickUp();
        commande.setPickUp(pickUp);
        assertEquals(pickUp, commande.getPickUp());
    }

    @Test
    void testGetSetDelivery() {
        Commande commande = new Commande();
        Delivery delivery = new Delivery();
        commande.setDelivery(delivery);
        assertEquals(delivery, commande.getDelivery());
    }
}
