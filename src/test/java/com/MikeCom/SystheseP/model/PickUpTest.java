package com.MikeCom.SystheseP.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

class PickUpTest {

    @Test
    void getIdAndSetId() {
        PickUp pickUp = new PickUp();
        pickUp.setId(1L);
        assertEquals(1L, pickUp.getId());
    }

    @Test
    void getDateRetraitAndSetDateRetrait() {
        PickUp pickUp = new PickUp();
        LocalDate date = LocalDate.of(2025, 4, 25);
        pickUp.setDateRetrait(date);
        assertEquals(date, pickUp.getDateRetrait());
    }

    @Test
    void getHeureRetraitAndSetHeureRetrait() {
        PickUp pickUp = new PickUp();
        LocalTime time = LocalTime.of(14, 30);
        pickUp.setHeureRetrait(time);
        assertEquals(time, pickUp.getHeureRetrait());
    }

    @Test
    void getPhoneAndSetPhone() {
        PickUp pickUp = new PickUp();
        pickUp.setPhone("5141234567");
        assertEquals("5141234567", pickUp.getPhone());
    }

    @Test
    void getNoteAndSetNote() {
        PickUp pickUp = new PickUp();
        pickUp.setNote("Veuillez venir avec votre numéro de commande.");
        assertEquals("Veuillez venir avec votre numéro de commande.", pickUp.getNote());
    }


    @Test
    void getCommandeAndSetCommande() {
        PickUp pickUp = new PickUp();
        Commande commande = new Commande();
        commande.setId(101L);

        pickUp.setCommande(commande);
        assertEquals(commande, pickUp.getCommande());
    }
}
