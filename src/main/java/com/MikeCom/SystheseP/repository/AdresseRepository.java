package com.MikeCom.SystheseP.repository;

import com.MikeCom.SystheseP.model.Adresse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdresseRepository extends JpaRepository<Adresse, Long> {
    // Custom query methods can be defined here if needed
}
