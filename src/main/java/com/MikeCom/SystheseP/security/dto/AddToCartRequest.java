package com.MikeCom.SystheseP.security.dto;

public class AddToCartRequest {
    private Long productId;
    private int quantity;

    // Getters & setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
