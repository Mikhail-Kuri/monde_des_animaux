package com.MikeCom.SystheseP.service.dto;

import com.MikeCom.SystheseP.model.Enum.OrderStatus;

import java.time.LocalDate;

public class AdminCommandeDto {

    private CommandeResponseDTO commandeResponseDTO;
    private DeliveryCommandeDTO deliveryCommandeDTO;

    private PickUpCommandeDTO pickUpCommandeDTO;

    private UserDTO userDTO;

    private OrderStatus orderStatus;

    private LocalDate dateCommande;

    public AdminCommandeDto(CommandeResponseDTO commandeResponseDTO, DeliveryCommandeDTO deliveryCommandeDTO, PickUpCommandeDTO pickUpCommandeDTO, UserDTO userDTO, OrderStatus orderStatus, LocalDate dateCommande) {
        this.commandeResponseDTO = commandeResponseDTO;
        this.deliveryCommandeDTO = deliveryCommandeDTO;
        this.pickUpCommandeDTO = pickUpCommandeDTO;
        this.userDTO = userDTO;
        this.orderStatus = orderStatus;
        this.dateCommande = dateCommande;
    }

    public AdminCommandeDto() {
    }

    public CommandeResponseDTO getCommandeResponseDTO() {
        return commandeResponseDTO;
    }

    public void setCommandeResponseDTO(CommandeResponseDTO commandeResponseDTO) {
        this.commandeResponseDTO = commandeResponseDTO;
    }

    public DeliveryCommandeDTO getDeliveryCommandeDTO() {
        return deliveryCommandeDTO;
    }

    public void setDeliveryCommandeDTO(DeliveryCommandeDTO deliveryCommandeDTO) {
        this.deliveryCommandeDTO = deliveryCommandeDTO;
    }

    public PickUpCommandeDTO getPickUpCommandeDTO() {
        return pickUpCommandeDTO;
    }

    public void setPickUpCommandeDTO(PickUpCommandeDTO pickUpCommandeDTO) {
        this.pickUpCommandeDTO = pickUpCommandeDTO;
    }

    public UserDTO getUserDTO() {
        return userDTO;
    }

    public void setUserDTO(UserDTO userDTO) {
        this.userDTO = userDTO;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }



    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public LocalDate getDateCommande() {
        return dateCommande;
    }

    public void setDateCommande(LocalDate dateCommande) {
        this.dateCommande = dateCommande;
    }
}
