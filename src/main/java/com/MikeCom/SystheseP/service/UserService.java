package com.MikeCom.SystheseP.service;

import com.MikeCom.SystheseP.model.*;
import com.MikeCom.SystheseP.model.Enum.ModeLivraison;
import com.MikeCom.SystheseP.model.Enum.OrderStatus;
import com.MikeCom.SystheseP.model.Enum.PaymentMethod;
import com.MikeCom.SystheseP.repository.*;
import com.MikeCom.SystheseP.security.Mappers.PanierMapper;
import com.MikeCom.SystheseP.security.Mappers.ProductMapper;
import com.MikeCom.SystheseP.security.dto.AddToCartRequest;
import com.MikeCom.SystheseP.service.dto.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final PanierRepository panierRepository;

    private final LignePanierRepository lignePanierRepository;

    private CommandeRepository commandeRepository;

    private AdresseRepository adresseRepository;

    private PaymentRepository paymentRepository;

    public UserService(UserRepository userRepository,
                       ProductRepository productRepository,
                       PanierRepository panierRepository,
                       LignePanierRepository lignePanierRepository,
                       CommandeRepository commandeRepository,
                       AdresseRepository adresseRepository,
                       PaymentRepository paymentRepository) {

        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.panierRepository = panierRepository;
        this.lignePanierRepository = lignePanierRepository;
        this.commandeRepository = commandeRepository;
        this.adresseRepository = adresseRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public LignePanierDto ajouterAuPanier(String username, AddToCartRequest request) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + username));

        Product product = productRepository.findById(Math.toIntExact(request.getProductId()))
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        Panier panier = panierRepository.findByUserIdWithProduits(user.getId()).orElse(null);
        if (panier == null) {
            panier = new Panier();
            panier.setUserId(user.getId());
            panier.setLignePaniers(new ArrayList<>());
            panier.setCurrent(true);
        }

        Optional<LignePanier> ligneExistante = panier.getLignePaniers().stream()
                .filter(ligne -> ligne.getProduct().getId().equals(product.getId()))
                .findFirst();

        int nouvelleQuantité;
        LignePanier var = new LignePanier();
        if (ligneExistante.isPresent()) {
            LignePanier ligne = ligneExistante.get();
            var = ligne;
            ligne.setQuantity(ligne.getQuantity() + request.getQuantity());
            nouvelleQuantité = ligne.getQuantity();
        } else {
            LignePanier nouvelleLigne = new LignePanier(product, request.getQuantity(), panier);
            var = nouvelleLigne;
            panier.getLignePaniers().add(nouvelleLigne);
            nouvelleQuantité = request.getQuantity();
        }

        panierRepository.save(panier);

        return new LignePanierDto(
                var.getId(),
                product.getId(),
                product.getName(),
                nouvelleQuantité,
                product.getPrice()
        );
    }

    public PanierDto getPanierPourUtilisateur(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + username));


        Panier panier = panierRepository.findByUserIdWithouProduits(user.getId())
                .orElseThrow(() -> new RuntimeException("Panier non trouvé pour l'utilisateur : " + username));

        return PanierMapper.toDto(panier);
    }

    public Commande createCommandePickUp(PickUpCommandeDTO dto) {
        Commande commande = new Commande();
        commande.setModeLivraison(ModeLivraison.PICKUP);
        commande.setPaymentMethod(PaymentMethod.valueOf(dto.getPaymentMethod()));
        commande.setDateCommande(LocalDate.now());


        // Récupérer le panier
        Panier panier = panierRepository.findById(dto.getPanierId())
                .orElseThrow(() -> new RuntimeException("Panier non trouvé pour l'utilisateur : " + dto.getPanierId()));

        panier.setCurrent(false); // Marquer le panier comme non courant
        List<LignePanier> lignePaniers = panier.getLignePaniers();
        if (lignePaniers.isEmpty()) {
            throw new RuntimeException("Aucune ligne de panier trouvée pour le panier ID : " + dto.getPanierId());
        }
        for (LignePanier ligne : lignePaniers) {
            Product product = ligne.getProduct();
            product.setQuantity(product.getQuantity() - ligne.getQuantity());
            productRepository.save(product); // Sauvegarder le produit mis à jour
            lignePanierRepository.save(ligne); // Sauvegarder la ligne de panier mise à jour
        }
        panierRepository.save(panier); // Sauvegarder le panier mis à jour
        commande.setPanier(panier);

        // Si paiement en magasin → générer le code
        String confirmationCode = null;
        if ("MAGASIN".equalsIgnoreCase(dto.getPaymentMethod())) {
            confirmationCode = generateConfirmationCode();
            commande.setConfirmationCode(confirmationCode);
            commande.setOrderStatus(OrderStatus.CONFIRMED);
        } else {
            commande.setOrderStatus(OrderStatus.PENDING);
        }

        // Créer le pick-up
        PickUp pickUp = new PickUp();
        pickUp.setDateRetrait(dto.getDate());
        pickUp.setHeureRetrait(dto.getTime());
        pickUp.setPhone(dto.getPhone());
        pickUp.setNote(dto.getNote());
        pickUp.setCommande(commande);

        commande.setPickUp(pickUp);

        return commandeRepository.save(commande);
    }

    public Commande createCommandeDelivery(DeliveryCommandeDTO dto) {
        Commande commande = new Commande();
        commande.setModeLivraison(ModeLivraison.DELIVERY);
        commande.setPaymentMethod(PaymentMethod.valueOf(dto.getPaymentMethod()));
        commande.setDateCommande(LocalDate.now());

        // Récupérer le panier
        Panier panier = panierRepository.findById(dto.getPanierId())
                .orElseThrow(() -> new RuntimeException("Panier non trouvé pour l'utilisateur : " + dto.getPanierId()));
        List<LignePanier> lignePaniers = panier.getLignePaniers();
        if (lignePaniers.isEmpty()) {
            throw new RuntimeException("Aucune ligne de panier trouvée pour le panier ID : " + dto.getPanierId());
        }
        for (LignePanier ligne : lignePaniers) {
            Product product = ligne.getProduct();
            product.setQuantity(product.getQuantity() - ligne.getQuantity());
            productRepository.save(product); // Sauvegarder le produit mis à jour
            lignePanierRepository.save(ligne); // Sauvegarder la ligne de panier mise à jour
        }
        panier.setCurrent(false); // Marquer le panier comme non courant
        panierRepository.save(panier); // Sauvegarder le panier mis à jour
        commande.setPanier(panier);

        // Si paiement en magasin → générer le code
        String confirmationCode = null;
        if ("MAISON".equalsIgnoreCase(dto.getPaymentMethod())) {
            confirmationCode = generateConfirmationCode();
            commande.setConfirmationCode(confirmationCode);
            commande.setOrderStatus(OrderStatus.CONFIRMED);
        } else {
            commande.setOrderStatus(OrderStatus.PENDING);
        }

        // Créer la livraison
        Delivery delivery = new Delivery();
        delivery.setDateRetrait(dto.getDate());
        delivery.setHeureRetrait(dto.getTime());
        delivery.setPhone(dto.getPhone());
        delivery.setNote(dto.getNote());

        Adresse adresse = new Adresse();
        adresse.setAdresse(dto.getAdresseDTO().getAdresse());
        adresse.setCodePostal(dto.getAdresseDTO().getCodePostal());
        adresse.setVille(dto.getAdresseDTO().getVille());
        adresse.setUserId(panier.getUserId());

        adresseRepository.save(adresse);

        delivery.setAdresse(adresse);
        delivery.setCommande(commande);
        commande.setDelivery(delivery);

        return commandeRepository.save(commande);
    }

    private String generateConfirmationCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public List<?> findPickUpCommandesByClientEmail(String username) {
        List<Object> commandes = new ArrayList<>();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + username));

        System.out.println(user.getFirstName() + "aaaaaaaaaaaaaaaaaaaaaaaaa");

        List<Panier> paniers = panierRepository.findByUserIdWithCommandes(user.getId());

        if (paniers.isEmpty()) {
            System.out.println("Aucun panier trouvé pour l'utilisateur : " + username);
            return commandes;
        }


        for (Panier panier : paniers) {
            System.out.println("Panier ID : " + panier.getId());
            Optional<Commande> commade = commandeRepository.findByPanier_IdAndConfirmationCodeIsNotNullAndOrderStatus(panier.getId(), OrderStatus.CONFIRMED);
            if (commade.isEmpty()) {
                System.out.println("Aucune commande trouvée pour le panier : " + panier.getId());
                continue;
            }
            System.out.println("Commande ID : " + commade.map(Commande::getId).orElse(null));

            if (commade.get().getPickUp() != null) {
                PickUp pickUp = commade.map(Commande::getPickUp).orElse(null);
                System.out.println("PickUp ID : " + pickUp.getId());
                PickUpCommandeDTO commandeDTO = new PickUpCommandeDTO();
                commandeDTO.setConfirmationCode(commade.get().getConfirmationCode());
                commandeDTO.setDate(pickUp.getDateRetrait());
                commandeDTO.setTime(pickUp.getHeureRetrait());
                commandeDTO.setPhone(pickUp.getPhone());
                commandeDTO.setNote(pickUp.getNote());
                commandeDTO.setPaymentMethod(commade.get().getPaymentMethod().name());
                commandes.add(commandeDTO);
            }

            if (commade.get().getDelivery() != null) {
                Delivery delivery = commade.map(Commande::getDelivery).orElse(null);
                System.out.println("Delivery ID : " + delivery.getId());
                DeliveryCommandeDTO commandeDTO = new DeliveryCommandeDTO();
                commandeDTO.setConfirmationCode(commade.get().getConfirmationCode());
                commandeDTO.setDate(delivery.getDateRetrait());
                commandeDTO.setTime(delivery.getHeureRetrait());
                commandeDTO.setPhone(delivery.getPhone());
                commandeDTO.setNote(delivery.getNote());
                commandeDTO.setPaymentMethod(commade.get().getPaymentMethod().name());
                commandeDTO.setAdresseDTO(new AdresseDTO(
                        delivery.getAdresse().getAdresse(),
                        delivery.getAdresse().getCodePostal(),
                        delivery.getAdresse().getVille()
                ));
                commandes.add(commandeDTO);
            }
        }
        return commandes;
    }

    public List<PickUpCommandeDTO> findPaymentOrdersByClientEmail(String username) {
        List<PickUpCommandeDTO> commandes = new ArrayList<>();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + username));

        List<Panier> paniers = panierRepository.findByUserIdWithCommandes(user.getId());

        for (Panier panier : paniers) {
            Optional<Commande> commandeOpt = commandeRepository.findByPanier_IdAndConfirmationCodeIsNull(panier.getId());
            if (commandeOpt.isEmpty()) continue;

            Commande commande = commandeOpt.get();
            PickUp pickUp = commande.getPickUp();
            if (pickUp == null) continue; // 👈 assure-toi que c'est bien une commande PickUp

            PickUpCommandeDTO commandeDTO = new PickUpCommandeDTO();
            commandeDTO.setPanierId(panier.getId());
            commandeDTO.setConfirmationCode(commande.getConfirmationCode());
            commandeDTO.setDate(pickUp.getDateRetrait());
            commandeDTO.setTime(pickUp.getHeureRetrait());
            commandeDTO.setPhone(pickUp.getPhone());
            commandeDTO.setNote(pickUp.getNote());
            commandeDTO.setPaymentMethod(commande.getPaymentMethod().name());
            commandes.add(commandeDTO);
        }

        return commandes;
    }


    public Panier getPanierById(Long id) {
        return panierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé pour l'ID : " + id));
    }

    public List<LignePanier> getLignePanierByPanierId(Long id) {
        Panier panier = panierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé pour l'ID : " + id));

        if (panier.getLignePaniers().isEmpty()) {
            throw new RuntimeException("Aucune ligne de panier trouvée pour le panier ID : " + id);
        }

        return panier.getLignePaniers(); // Retourne la première ligne de panier
    }

    public List<AdminProductCommandeDto> getLignePanierByCommandeId(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée pour l'ID : " + id));

        if (commande.getPanier().getLignePaniers().isEmpty()) {
            throw new RuntimeException("Aucune ligne de panier trouvée pour la commande ID : " + id);
        }

        return commande.getPanier().getLignePaniers().stream()
                .map(lp -> new AdminProductCommandeDto(
                        ProductMapper.toDTO(lp.getProduct()),
                        lp.getQuantity()
                ))
                .toList();
    }

    public List<DeliveryCommandeDTO> findDeliveryOrdersByClientEmail(String username) {
        List<DeliveryCommandeDTO> commandes = new ArrayList<>();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + username));

        List<Panier> paniers = panierRepository.findByUserIdWithCommandes(user.getId());

        for (Panier panier : paniers) {
            Optional<Commande> commandeOpt = commandeRepository.findByPanier_IdAndConfirmationCodeIsNull(panier.getId());
            if (commandeOpt.isEmpty()) continue;

            Commande commande = commandeOpt.get();
            Delivery delivery = commande.getDelivery();
            if (delivery == null) continue; // 👈 assure-toi que c'est bien une commande Delivery

            DeliveryCommandeDTO commandeDTO = new DeliveryCommandeDTO();
            commandeDTO.setPanierId(panier.getId());
            commandeDTO.setConfirmationCode(commande.getConfirmationCode());
            commandeDTO.setDate(delivery.getDateRetrait());
            commandeDTO.setTime(delivery.getHeureRetrait());
            commandeDTO.setPhone(delivery.getPhone());
            commandeDTO.setNote(delivery.getNote());
            commandeDTO.setPaymentMethod(commande.getPaymentMethod().name());
            commandeDTO.setAdresseDTO(new AdresseDTO(
                    delivery.getAdresse().getAdresse(),
                    delivery.getAdresse().getCodePostal(),
                    delivery.getAdresse().getVille()
            ));
            commandes.add(commandeDTO);
        }

        return commandes;
    }

    public Commande upDateCommandeWithPanierId(PaymentRequest paymentRequest) {
        Long panierId = paymentRequest.getPanierId();
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé pour l'ID : " + panierId));

        if (panier.getLignePaniers().isEmpty()) {
            throw new RuntimeException("Aucune ligne de panier trouvée pour le panier ID : " + panierId);
        }

        // Mettre à jour la commande avec le panier
        Commande commande = commandeRepository.findByPanierId(panierId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée pour le panier ID : " + panierId));

        commande.setConfirmationCode(generateConfirmationCode());
        commande.setOrderStatus(OrderStatus.CONFIRMED);

        // Mise à jour de la commande en fonction de la livraison ou du retrait
        Commande updatedCommande = checkForDeliveryOrPickUpAndUpdate(commande, paymentRequest);

        return commandeRepository.save(updatedCommande);
    }

    private Commande checkForDeliveryOrPickUpAndUpdate(Commande commande, PaymentRequest paymentRequest) {
        // Mise à jour pour PICKUP
        if (commande.getModeLivraison() == ModeLivraison.PICKUP) {
            PickUp pickUp = commande.getPickUp();
            if (pickUp != null) {
                pickUp.setDateRetrait(paymentRequest.getDate());
                pickUp.setHeureRetrait(paymentRequest.getHeure());
            } else {
                // Si PickUp est null, initialiser un nouveau PickUp
                pickUp = new PickUp();
                pickUp.setDateRetrait(paymentRequest.getDate());
                pickUp.setHeureRetrait(paymentRequest.getHeure());
                commande.setPickUp(pickUp);
            }
        } else if (commande.getModeLivraison() == ModeLivraison.DELIVERY) {
            Delivery delivery = commande.getDelivery();
            if (delivery != null) {
                delivery.setDateRetrait(paymentRequest.getDate());
                delivery.setHeureRetrait(paymentRequest.getHeure());
            } else {
                // Si Delivery est null, initialiser un nouveau Delivery
                delivery = new Delivery();
                delivery.setDateRetrait(paymentRequest.getDate());
                delivery.setHeureRetrait(paymentRequest.getHeure());
                commande.setDelivery(delivery);
            }
        }

        return commande;
    }

    public void savePayment(Commande commande) {
        Long userId = commande.getPanier().getUserId();
        Long commandeId = commande.getId();

        Payment payment = new Payment();
        payment.setCommandeId(commandeId);
        payment.setUserId(userId);
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentTime(LocalTime.now());
        paymentRepository.save(payment);
    }


    public String updateCommandeStatus(Long id, String status) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée pour l'ID : " + id));

        // Enlève les guillemets si présents (venant du JSON)
        status = status.replace("\"", "");

        OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
        commande.setOrderStatus(orderStatus);
        commandeRepository.save(commande);

        return "Commande mise à jour avec succès !";
    }
}
