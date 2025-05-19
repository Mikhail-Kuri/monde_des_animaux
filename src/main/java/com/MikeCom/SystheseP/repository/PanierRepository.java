package com.MikeCom.SystheseP.repository;

import com.MikeCom.SystheseP.model.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PanierRepository extends JpaRepository<Panier, Long> {


    @Query("SELECT p FROM Panier p LEFT JOIN FETCH p.lignePaniers lp WHERE p.userId = :userId AND p.isCurrent = true ")
    Optional<Panier> findByUserIdWithProduits(@Param("userId") Long userId);

    @Query("SELECT p FROM Panier p WHERE p.userId = :userId AND p.isCurrent = true")
    Optional<Panier> findByUserIdWithouProduits(Long userId);

    @Query("SELECT p FROM Panier p LEFT JOIN FETCH p.lignePaniers lp WHERE p.userId = :id AND p.isCurrent = false")
    List<Panier> findByUserIdWithCommandes(Long id);
}
