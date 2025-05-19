package com.MikeCom.SystheseP.service.dto;

public class AdresseDTO {
    private String adresse;
    private String codePostal;
    private String ville;

    public AdresseDTO() {
    }

    public AdresseDTO(String adresse, String codePostal, String ville) {
        this.adresse = adresse;
        this.codePostal = codePostal;
        this.ville = ville;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }
}
