package com.MikeCom.SystheseP.service.dto;

import com.MikeCom.SystheseP.model.Enum.Brand;
import com.MikeCom.SystheseP.model.Enum.Category;
import com.MikeCom.SystheseP.model.Product;

public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private Category category;
    private double price;
    private int quantity;
    private String imageBase64;
    private Brand brand;
    private double weight;

    // Constructeurs
    public ProductDTO() {}

    public ProductDTO(Long id,String name, String description, Category category, double price, int quantity, String imageBase64, Brand brand, double weight) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
        this.imageBase64 = imageBase64;
        this.brand = brand;
        this.weight = weight;
    }

    public ProductDTO(Product product) {
    }


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

    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }

    public Brand getBrand() { return brand; }
    public void setBrand(Brand brand) { this.brand = brand; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
}
