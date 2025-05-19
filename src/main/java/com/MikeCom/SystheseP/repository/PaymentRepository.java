package com.MikeCom.SystheseP.repository;

import com.MikeCom.SystheseP.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByCommandeId(Long commandeId);

    Optional<Payment> findByUserId(Long userId);

    @Query("SELECT p FROM Payment p WHERE p.commandeId = ?1 AND p.userId = ?2")
    Optional<Payment> findByCommandeIdAndUserId(Long commandeId, Long userId);
}
