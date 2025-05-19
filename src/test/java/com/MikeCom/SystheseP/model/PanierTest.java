package com.MikeCom.SystheseP.model;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PanierTest {

    @Test
    void addLignePanier() {
        Panier panier = new Panier();
        LignePanier ligne = new LignePanier();

        panier.addLignePanier(ligne);

        assertEquals(1, panier.getLignePaniers().size());
        assertTrue(panier.getLignePaniers().contains(ligne));
        assertEquals(panier, ligne.getPanier());
    }

    @Test
    void removeLignePanier() {
        Panier panier = new Panier();
        LignePanier ligne = new LignePanier();
        panier.addLignePanier(ligne);

        panier.removeLignePanier(ligne);

        assertEquals(0, panier.getLignePaniers().size());
        assertNull(ligne.getPanier());
    }

    @Test
    void getIdAndSetId() {
        Panier panier = new Panier();
        panier.setId(99L);
        assertEquals(99L, panier.getId());
    }

    @Test
    void getUserIdAndSetUserId() {
        Panier panier = new Panier();
        panier.setUserId(123L);
        assertEquals(123L, panier.getUserId());
    }

    @Test
    void getLignePaniersAndSetLignePaniers() {
        Panier panier = new Panier();
        LignePanier ligne1 = new LignePanier();
        LignePanier ligne2 = new LignePanier();
        List<LignePanier> lignes = new ArrayList<>();
        lignes.add(ligne1);
        lignes.add(ligne2);

        panier.setLignePaniers(lignes);
        assertEquals(2, panier.getLignePaniers().size());
        assertEquals(ligne1, panier.getLignePaniers().get(0));
    }

    @Test
    void isCurrentAndSetCurrent() {
        Panier panier = new Panier();
        panier.setCurrent(true);
        assertTrue(panier.isCurrent());
    }
}
