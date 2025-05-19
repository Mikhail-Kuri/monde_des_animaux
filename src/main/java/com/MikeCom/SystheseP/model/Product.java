package com.MikeCom.SystheseP.model;

import com.MikeCom.SystheseP.model.Enum.Brand;
import com.MikeCom.SystheseP.model.Enum.Category;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int quantity;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] image;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Brand brand;

    private double weight;

    // Constructeur par défaut
    public Product() {}

    // Constructeur avec image
    public Product(String name, String description, Category category, double price, int quantity, byte[] image, Brand brand, double weight) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
        this.brand = brand;
        this.weight = weight;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }

    public Brand getBrand() { return brand; }
    public void setBrand(Brand brand) { this.brand = brand; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
}
