    package com.MikeCom.SystheseP.model;

    import com.MikeCom.SystheseP.model.Enum.ModeLivraison;
    import com.MikeCom.SystheseP.model.Enum.OrderStatus;
    import com.MikeCom.SystheseP.model.Enum.PaymentMethod;
    import jakarta.persistence.*;

    import java.time.LocalDate;

    @Entity
    public class Commande {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String confirmationCode;

        @Enumerated(EnumType.STRING)
        private ModeLivraison modeLivraison;

        @Enumerated(EnumType.STRING)
        private PaymentMethod paymentMethod;

        @OneToOne
        @JoinColumn(name = "panier_id")
        private Panier panier;

        @OneToOne(mappedBy = "commande", cascade = CascadeType.ALL)
        private PickUp pickUp;

        @OneToOne(mappedBy = "commande", cascade = CascadeType.ALL)
        private Delivery delivery;

        @Enumerated(EnumType.STRING)
        private OrderStatus orderStatus;

        private LocalDate dateCommande;

        // Getters & Setters

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Panier getPanier() {
            return panier;
        }

        public void setPanier(Panier panier) {
            this.panier = panier;
        }

        public String getConfirmationCode() {
            return confirmationCode;
        }

        public void setConfirmationCode(String confirmationCode) {
            this.confirmationCode = confirmationCode;
        }

        public ModeLivraison getModeLivraison() {
            return modeLivraison;
        }

        public void setModeLivraison(ModeLivraison modeLivraison) {
            this.modeLivraison = modeLivraison;
        }

        public PaymentMethod getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(PaymentMethod paymentMethod) {
            this.paymentMethod = paymentMethod;
        }

        public PickUp getPickUp() {
            return pickUp;
        }

        public void setPickUp(PickUp pickUp) {
            this.pickUp = pickUp;
        }

        public Delivery getDelivery() {
            return delivery;
        }

        public void setDelivery(Delivery delivery) {
            this.delivery = delivery;
        }

        public OrderStatus getOrderStatus() {
            return orderStatus;
        }

        public void setOrderStatus(OrderStatus status) {
            this.orderStatus = status;
        }

        public LocalDate getDateCommande() {
            return dateCommande;
        }

        public void setDateCommande(LocalDate dateCommande) {
            this.dateCommande = dateCommande;
        }
    }
