package com.MikeCom.SystheseP.repository;

import com.MikeCom.SystheseP.model.LignePanier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LignePanierRepository extends JpaRepository<LignePanier, Long> {
}
