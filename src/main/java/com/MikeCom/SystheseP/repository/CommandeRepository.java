package com.MikeCom.SystheseP.repository;

import com.MikeCom.SystheseP.model.Commande;
import com.MikeCom.SystheseP.model.Enum.OrderStatus;
import com.MikeCom.SystheseP.model.Enum.PaymentMethod;
import com.MikeCom.SystheseP.model.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CommandeRepository  extends JpaRepository<Commande, Long> {
    Optional<Commande> findByPanierId(Long id);

    Optional<Commande> findByPanier_IdAndConfirmationCodeIsNotNullAndOrderStatus(Long id, OrderStatus status);

    Optional<Commande> findByPanier_IdAndConfirmationCodeIsNull(Long panier_id);
}
