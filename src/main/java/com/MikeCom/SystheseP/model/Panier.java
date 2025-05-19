package com.MikeCom.SystheseP.model;

import com.MikeCom.SystheseP.model.LignePanier;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
public class Panier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<LignePanier> lignePaniers = new ArrayList<>();

    @Column(name = "is_current")
    private boolean isCurrent;

    // ➕ Ajouter une ligne (et mettre à jour la relation inverse)
    public void addLignePanier(LignePanier ligne) {
        lignePaniers.add(ligne);
        ligne.setPanier(this);
    }

    public void removeLignePanier(LignePanier ligne) {
        lignePaniers.remove(ligne);
        ligne.setPanier(null);
    }

    // Getters & Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public List<LignePanier> getLignePaniers() { return lignePaniers; }

    public void setLignePaniers(List<LignePanier> lignePaniers) {
        this.lignePaniers = lignePaniers;
    }

    public boolean isCurrent() { return isCurrent; }

    public void setCurrent(boolean current) { isCurrent = current; }
}
