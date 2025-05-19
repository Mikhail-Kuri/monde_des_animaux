package com.MikeCom.SystheseP.service;

import com.MikeCom.SystheseP.model.Commande;
import com.MikeCom.SystheseP.model.Delivery;
import com.MikeCom.SystheseP.model.PickUp;
import com.MikeCom.SystheseP.model.User;
import com.MikeCom.SystheseP.repository.CommandeRepository;
import com.MikeCom.SystheseP.repository.DeliveryRepository;
import com.MikeCom.SystheseP.repository.PickUpRepository;
import com.MikeCom.SystheseP.repository.UserRepository;
import com.MikeCom.SystheseP.service.dto.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService implements UserDetailsService {

    private final UserRepository userRepository;

    private final CommandeRepository commandeRepository;

    private final DeliveryRepository deliveryRepository;

    private final PickUpRepository pickUpRepository;

    public AdminService(UserRepository userRepository, CommandeRepository commandeRepository, DeliveryRepository deliveryRepository, PickUpRepository pickUpRepository) {
        this.userRepository = userRepository;
        this.commandeRepository = commandeRepository;
        this.deliveryRepository = deliveryRepository;
        this.pickUpRepository = pickUpRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public List<AdminCommandeDto> getAllCommandes() {
        try {
            List<Commande> commandes = commandeRepository.findAll();
            List<PickUp> pickUps = pickUpRepository.findAll();
            List<Delivery> deliveries = deliveryRepository.findAll();

            List<AdminCommandeDto> adminCommandes = new ArrayList<>();

            for (Commande commande : commandes) {
                AdminCommandeDto adminCommandeDto = new AdminCommandeDto();
                adminCommandeDto.setDateCommande(commande.getDateCommande());
                UserDTO userDTO = new UserDTO();
                User user = null;
                Long userIdLong = commande.getPanier().getUserId();
                if (userIdLong != null) {
                    Integer userId = userIdLong.intValue();
                    user = userRepository.findById(userId).orElse(null);
                }
                if (user != null) {
                    userDTO.setFirstName(user.getFirstName());
                    userDTO.setLastName(user.getLastName());
                    userDTO.setEmail(user.getEmail());
                    userDTO.setPhoneNumber(user.getPhoneNumber());
                    userDTO.setAddress(user.getAddress());
                    userDTO.setRole(user.getRole().toString());
                    adminCommandeDto.setUserDTO(userDTO);
                }

                // Ajouter le statut de la commande
                if (commande.getOrderStatus() != null) {
                    adminCommandeDto.setOrderStatus(commande.getOrderStatus());
                }

                CommandeResponseDTO commandeResponseDTO = new CommandeResponseDTO();

                commandeResponseDTO.setId(commande.getId());
                commandeResponseDTO.setConfirmationCode(commande.getConfirmationCode());
                commandeResponseDTO.setMessage("Commande récupérée avec succès");

                adminCommandeDto.setCommandeResponseDTO(commandeResponseDTO);

                // Ajouter les infos PickUp si elles existent
                if (commande.getPickUp() != null) {
                    PickUp pickUp = commande.getPickUp();

                    PickUpCommandeDTO pickUpCommandeDTO = new PickUpCommandeDTO();
                    pickUpCommandeDTO.setDate(pickUp.getDateRetrait());
                    pickUpCommandeDTO.setTime(pickUp.getHeureRetrait());
                    pickUpCommandeDTO.setConfirmationCode(pickUp.getCommande().getConfirmationCode());
                    pickUpCommandeDTO.setPaymentMethod(pickUp.getCommande().getPaymentMethod().toString());
                    pickUpCommandeDTO.setPhone(pickUp.getPhone());
                    pickUpCommandeDTO.setNote(pickUp.getNote());
                    pickUpCommandeDTO.setPanierId(pickUp.getCommande().getPanier() != null ? pickUp.getCommande().getPanier().getId() : null);

                    adminCommandeDto.setPickUpCommandeDTO(pickUpCommandeDTO);
                }

                // Ajouter les infos Delivery si elles existent
                if (commande.getDelivery() != null) {
                    Delivery delivery = commande.getDelivery();

                    DeliveryCommandeDTO deliveryCommandeDTO = new DeliveryCommandeDTO();
                    deliveryCommandeDTO.setConfirmationCode(delivery.getCommande().getConfirmationCode());
                    deliveryCommandeDTO.setPaymentMethod(delivery.getCommande().getPaymentMethod().toString());
                    deliveryCommandeDTO.setPhone(delivery.getPhone());
                    deliveryCommandeDTO.setNote(delivery.getNote());
                    deliveryCommandeDTO.setDate(delivery.getDateRetrait());
                    deliveryCommandeDTO.setTime(delivery.getHeureRetrait());
                    deliveryCommandeDTO.setPanierId(delivery.getCommande().getPanier() != null ? delivery.getCommande().getPanier().getId() : null);

                    if (delivery.getAdresse() != null) {
                        AdresseDTO adresseDTO = new AdresseDTO();
                        adresseDTO.setAdresse(delivery.getAdresse().getAdresse());
                        adresseDTO.setVille(delivery.getAdresse().getVille());
                        adresseDTO.setCodePostal(delivery.getAdresse().getCodePostal());
                        deliveryCommandeDTO.setAdresseDTO(adresseDTO);
                    }

                    adminCommandeDto.setDeliveryCommandeDTO(deliveryCommandeDTO);
                }

                // Ajouter à la liste finale
                adminCommandes.add(adminCommandeDto);
            }

            return adminCommandes;

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des commandes : " + e.getMessage());
        }
    }

}
