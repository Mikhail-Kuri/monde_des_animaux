package com.MikeCom.SystheseP.security.Mappers;

import com.MikeCom.SystheseP.model.Adresse;
import com.MikeCom.SystheseP.service.dto.AdresseDTO;

public class AdresseMapper {

    public static AdresseDTO toDto(Adresse adresse) {
        if (adresse == null) {
            return null;
        }
        AdresseDTO adresseDTO = new AdresseDTO();
        adresseDTO.setAdresse(adresse.getAdresse());
        adresseDTO.setCodePostal(adresse.getCodePostal());
        adresseDTO.setVille(adresse.getVille());
        return adresseDTO;
    }

    public static Adresse toEntity(AdresseDTO adresseDTO) {
        if (adresseDTO == null) {
            return null;
        }
        Adresse adresse = new Adresse();
        adresse.setAdresse(adresseDTO.getAdresse());
        adresse.setCodePostal(adresseDTO.getCodePostal());
        adresse.setVille(adresseDTO.getVille());
        return adresse;
    }
}
