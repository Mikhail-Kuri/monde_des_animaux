package com.MikeCom.SystheseP.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "cart_line")
public class LignePanier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_line_id")
    private Long id;

    @JoinColumn(name = "product_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Product product;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Panier panier;

    // Constructors
    public LignePanier() {}

    public LignePanier(Product product, int quantity, Panier panier) {
        this.product = product;
        this.quantity = quantity;
        this.panier = panier;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }

    public void setProduct(Product product) { this.product = product; }

    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) { this.quantity = quantity; }

    public Panier getPanier() { return panier; }

    public void setPanier(Panier panier) { this.panier = panier; }


}
