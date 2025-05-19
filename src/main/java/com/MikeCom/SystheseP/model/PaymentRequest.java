package com.MikeCom.SystheseP.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class PaymentRequest {

    private Long panierId;
    private List<LignePanier> lignePaniers;
    private Long total;
    private LocalTime heure;
    private LocalDate date;



    public LocalTime getHeure() {
        return heure;
    }

    public void setHeure(LocalTime heure) {
        this.heure = heure;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }


//    public String getCardHolder() {
//        return cardHolder;
//    }
//
//    public void setCardHolder(String cardHolder) {
//        this.cardHolder = cardHolder;
//    }
//
//    public String getCardNumber() {
//        return cardNumber;
//    }
//
//    public void setCardNumber(String cardNumber) {
//        this.cardNumber = cardNumber;
//    }
//
//    public String getExpiration() {
//        return expiration;
//    }
//
//    public void setExpiration(String expiration) {
//        this.expiration = expiration;
//    }
//
//    public String getCvv() {
//        return cvv;
//    }
//
//    public void setCvv(String cvv) {
//        this.cvv = cvv;
//    }

    public Long getPanierId() {
        return panierId;
    }

    public void setPanierId(Long panierId) {
        this.panierId = panierId;
    }

    public List<LignePanier> getLignePaniers() {
        return lignePaniers;
    }

    public void setLignePaniers(List<LignePanier> lignePaniers) {
        this.lignePaniers = lignePaniers;
    }
//
//    public boolean isSaveCard() {
//        return saveCard;
//    }
//
//    public void setSaveCard(boolean saveCard) {
//        this.saveCard = saveCard;
//    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
    // getters & setters
}


