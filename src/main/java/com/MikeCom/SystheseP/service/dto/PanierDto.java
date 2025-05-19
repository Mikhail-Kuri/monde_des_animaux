package com.MikeCom.SystheseP.service.dto;

import java.util.List;

public class PanierDto {

    private Long id;
    private List<LignePanierDto> lignePaniers;

    public PanierDto() {}

    public PanierDto(List<LignePanierDto> ligneDtos, Long id) {
        this.lignePaniers = ligneDtos;
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PanierDto(List<LignePanierDto> lignePaniers) {
        this.lignePaniers = lignePaniers;
    }


    public List<LignePanierDto> getLignePaniers() {
        return lignePaniers;
    }

    public void setLignePaniers(List<LignePanierDto> lignePaniers) {
        this.lignePaniers = lignePaniers;
    }
}
