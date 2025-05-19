package com.MikeCom.SystheseP.service;

import com.MikeCom.SystheseP.model.*;
import com.MikeCom.SystheseP.model.Enum.ModeLivraison;
import com.MikeCom.SystheseP.model.Enum.OrderStatus;
import com.MikeCom.SystheseP.model.Enum.PaymentMethod;
import com.MikeCom.SystheseP.repository.*;
import com.MikeCom.SystheseP.security.Mappers.PanierMapper;
import com.MikeCom.SystheseP.security.dto.AddToCartRequest;
import com.MikeCom.SystheseP.service.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepository userRepository;

    private ProductRepository productRepository;

    private PanierRepository panierRepository;

    private LignePanierRepository lignePanierRepository;

    private CommandeRepository commandeRepository;

    private AdresseRepository adresseRepository;

    private PaymentRepository paymentRepository;

    private UserService userService;

    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);
        productRepository = mock(ProductRepository.class);
        panierRepository = mock(PanierRepository.class);
        lignePanierRepository = mock(LignePanierRepository.class);
        commandeRepository = mock(CommandeRepository.class);
        adresseRepository = mock(AdresseRepository.class);
        paymentRepository = mock(PaymentRepository.class);


        userService = new UserService(userRepository, productRepository, panierRepository, lignePanierRepository, commandeRepository, adresseRepository,paymentRepository);
    }

    @Test
    void loadUserByUsername_shouldReturnUserDetails_whenUserExists() {
        // Arrange
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);
        user.setPassword("securePass123");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        UserDetails result = userService.loadUserByUsername(email);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getUsername());
        assertEquals("securePass123", result.getPassword());
    }

    @Test
    void findByEmail() {
        // Arrange
        String email = "user@example.com";
        User mockUser = new User();
        mockUser.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));

        // Act
        User result = userService.findByEmail(email);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void ajouterAuPanier() {
        // Arrange
        String email = "user@example.com";
        Long userId = 1L;
        Long productId = 10L;

        User user = new User();
        user.setId(userId);
        user.setEmail(email);

        Product product = new Product();
        product.setId(productId);
        product.setName("Produit Test");
        product.setPrice(20.0);

        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(productId);
        request.setQuantity(3);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(productRepository.findById(productId.intValue())).thenReturn(Optional.of(product));
        when(panierRepository.findByUserIdWithProduits(userId)).thenReturn(Optional.empty());
        when(panierRepository.save(any(Panier.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        LignePanierDto dto = userService.ajouterAuPanier(email, request);

        // Assert
        assertNotNull(dto);
        assertEquals(productId, dto.getProductId());
        assertEquals("Produit Test", dto.getProductName());
        assertEquals(3, dto.getQuantity());
        assertEquals(20.0, dto.getPrice());

        verify(userRepository).findByEmail(email);
        verify(productRepository).findById(productId.intValue());
        verify(panierRepository).save(any(Panier.class));
    }

    @Test
    void getPanierPourUtilisateur() {
        // Arrange
        String email = "user@example.com";
        Long userId = 1L;

        User user = new User();
        user.setId(userId);
        user.setEmail(email);

        Panier panier = new Panier();
        panier.setId(100L);
        panier.setUserId(userId);
        panier.setCurrent(true);
        panier.setLignePaniers(Collections.emptyList());

        PanierDto expectedDto = new PanierDto();
        expectedDto.setId(100L);


        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(panierRepository.findByUserIdWithouProduits(userId)).thenReturn(Optional.of(panier));

        // Act
        PanierDto result = userService.getPanierPourUtilisateur(email);

        // Assert
        assertNotNull(result);
        assertEquals(expectedDto.getId(), result.getId());
        assertEquals(expectedDto.getId(), result.getId());

        verify(userRepository).findByEmail(email);
        verify(panierRepository).findByUserIdWithouProduits(userId);
    }


    @Test
    void createCommandePickUp() {
        // Arrange
        Long panierId = 1L;
        PickUpCommandeDTO dto = new PickUpCommandeDTO();
        dto.setPanierId(panierId);
        dto.setDate(LocalDate.of(2025, 5, 10));
        dto.setTime(LocalTime.of(14, 30));
        dto.setPhone("1234567890");
        dto.setNote("Merci");
        dto.setPaymentMethod("MAGASIN");

        Panier panier = new Panier();
        panier.setId(panierId);
        panier.setCurrent(true);

        when(panierRepository.findById(panierId)).thenReturn(Optional.of(panier));
        when(panierRepository.save(any(Panier.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(commandeRepository.save(any(Commande.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Commande commande = userService.createCommandePickUp(dto);

        // Assert
        assertNotNull(commande);
        assertEquals(ModeLivraison.PICKUP, commande.getModeLivraison());
        assertEquals(PaymentMethod.MAGASIN, commande.getPaymentMethod());
        assertNotNull(commande.getConfirmationCode());
        assertNotNull(commande.getPickUp());
        assertEquals(dto.getPhone(), commande.getPickUp().getPhone());
        assertEquals(dto.getDate(), commande.getPickUp().getDateRetrait());
        assertEquals(dto.getTime(), commande.getPickUp().getHeureRetrait());
        assertEquals(dto.getNote(), commande.getPickUp().getNote());

        verify(panierRepository).findById(panierId);
        verify(panierRepository).save(panier);
        verify(commandeRepository).save(any(Commande.class));
    }


    @Test
    void createCommandeDelivery() {
        // Arrange
        Long panierId = 2L;
        DeliveryCommandeDTO dto = new DeliveryCommandeDTO();
        dto.setPanierId(panierId);
        dto.setPhone("5141234567");
        dto.setPaymentMethod("EN_LIGNE");

        // Créer et affecter un AdresseDTO valide
        AdresseDTO adresseDTO = new AdresseDTO();
        adresseDTO.setAdresse("123 rue Principale");
        adresseDTO.setVille("Montréal");
        adresseDTO.setCodePostal("H1A2B3");
        dto.setAdresseDTO(adresseDTO);

        Panier panier = new Panier();
        panier.setId(panierId);
        panier.setCurrent(true);

        when(panierRepository.findById(panierId)).thenReturn(Optional.of(panier));
        when(panierRepository.save(any(Panier.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(commandeRepository.save(any(Commande.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Commande commande = userService.createCommandeDelivery(dto);

        // Assert
        assertNotNull(commande);
        assertEquals(ModeLivraison.DELIVERY, commande.getModeLivraison());
        assertEquals(PaymentMethod.EN_LIGNE, commande.getPaymentMethod());
        assertNotNull(commande.getDelivery());
        assertEquals(dto.getPhone(), commande.getDelivery().getPhone());
        assertEquals(adresseDTO.getAdresse(), commande.getDelivery().getAdresse().getAdresse());
        assertEquals(adresseDTO.getVille(), commande.getDelivery().getAdresse().getVille());
        assertEquals(adresseDTO.getCodePostal(), commande.getDelivery().getAdresse().getCodePostal());

        verify(panierRepository).findById(panierId);
        verify(panierRepository).save(panier);
        verify(commandeRepository).save(any(Commande.class));
    }



    @Test
    void findPickUpCommandesByClientEmail() {
        // Arrange
        String email = "user@example.com";
        Long userId = 1L;
        Long panierId = 10L;
        Long commandeId = 100L;
        Long pickUpId = 200L;

        User user = new User();
        user.setId(userId);
        user.setEmail(email);
        user.setFirstName("John");

        Panier panier = new Panier();
        panier.setId(panierId);
        panier.setUserId(userId);

        Commande commande = new Commande();
        commande.setId(commandeId);
        commande.setConfirmationCode("CONF123");
        commande.setPaymentMethod(PaymentMethod.MAGASIN);

        PickUp pickUp = new PickUp();
        pickUp.setId(pickUpId);
        pickUp.setDateRetrait(LocalDate.now());
        pickUp.setHeureRetrait(LocalTime.NOON);
        pickUp.setPhone("5141234567");
        pickUp.setNote("Test Note");
        commande.setPickUp(pickUp);

        pickUp.setCommande(commande); // lier le pick-up à la commande

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(panierRepository.findByUserIdWithCommandes(userId)).thenReturn(List.of(panier));
        when(commandeRepository.findByPanier_IdAndConfirmationCodeIsNotNullAndOrderStatus(panierId, OrderStatus.CONFIRMED)).thenReturn(Optional.of(commande));

        // Act
        List<?> result = userService.findPickUpCommandesByClientEmail(email);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0) instanceof PickUpCommandeDTO);
        PickUpCommandeDTO dto = (PickUpCommandeDTO) result.get(0);
        assertEquals("CONF123", dto.getConfirmationCode());
        assertEquals("5141234567", dto.getPhone());
        assertEquals("Test Note", dto.getNote());
        assertEquals("MAGASIN", dto.getPaymentMethod());

        verify(userRepository).findByEmail(email);
        verify(panierRepository).findByUserIdWithCommandes(userId);
        verify(commandeRepository).findByPanier_IdAndConfirmationCodeIsNotNullAndOrderStatus(panierId, OrderStatus.CONFIRMED);
    }


    @Test
    void findPaymentOrdersByClientEmail() {
        // Arrange
        String email = "user@example.com";
        Long userId = 1L;
        Long panierId = 10L;
        Long commandeId = 100L;
        Long pickUpId = 200L;

        User user = new User();
        user.setId(userId);
        user.setEmail(email);

        Panier panier = new Panier();
        panier.setId(panierId);
        panier.setUserId(userId);

        Commande commande = new Commande();
        commande.setId(commandeId);
        commande.setConfirmationCode(null); // pas encore payé
        commande.setPaymentMethod(PaymentMethod.MAGASIN);

        PickUp pickUp = new PickUp();
        pickUp.setId(pickUpId);
        pickUp.setDateRetrait(LocalDate.now());
        pickUp.setHeureRetrait(LocalTime.of(14, 0));
        pickUp.setPhone("5141234567");
        pickUp.setNote("En attente de paiement");
        commande.setPickUp(pickUp);

        pickUp.setCommande(commande); // lier la commande

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(panierRepository.findByUserIdWithCommandes(userId)).thenReturn(List.of(panier));
        when(commandeRepository.findByPanier_IdAndConfirmationCodeIsNull(panierId)).thenReturn(Optional.of(commande));

        // Act
        List<PickUpCommandeDTO> result = userService.findPaymentOrdersByClientEmail(email);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        PickUpCommandeDTO dto = result.get(0);
        assertEquals(panierId, dto.getPanierId());
        assertNull(dto.getConfirmationCode()); // toujours null
        assertEquals("MAGASIN", dto.getPaymentMethod());
        assertEquals("5141234567", dto.getPhone());
        assertEquals("En attente de paiement", dto.getNote());

        // Verify mocks
        verify(userRepository).findByEmail(email);
        verify(panierRepository).findByUserIdWithCommandes(userId);
        verify(commandeRepository).findByPanier_IdAndConfirmationCodeIsNull(panierId);
    }


    @Test
    void getPanierById(){
        // Arrange
        Long panierId = 1L;
        Panier expectedPanier = new Panier();
        expectedPanier.setId(panierId);

        when(panierRepository.findById(panierId)).thenReturn(Optional.of(expectedPanier));

        // Act
        Panier result = userService.getPanierById(panierId);

        // Assert
        assertNotNull(result);
        assertEquals(panierId, result.getId());

        verify(panierRepository).findById(panierId);
    }


    @Test
    void getLignePanierByPanierId() {
        // Arrange
        Long panierId = 1L;
        LignePanier ligne = new LignePanier();
        ligne.setId(10L);
        List<LignePanier> lignes = List.of(ligne);

        Panier panier = new Panier();
        panier.setId(panierId);
        panier.setLignePaniers(lignes);

        when(panierRepository.findById(panierId)).thenReturn(Optional.of(panier));

        // Act
        List<LignePanier> result = userService.getLignePanierByPanierId(panierId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).getId());
        verify(panierRepository).findById(panierId);
    }


    @Test
    void findDeliveryOrdersByClientEmail() {
        // Arrange
        String email = "client@example.com";
        Long panierId = 1L;

        User user = new User();
        user.setId(42L);
        user.setEmail(email);

        Adresse adresse = new Adresse();
        adresse.setAdresse("123 Rue Test");
        adresse.setCodePostal("H1A1A1");
        adresse.setVille("Montréal");

        Delivery delivery = new Delivery();
        delivery.setDateRetrait(LocalDate.now());
        delivery.setHeureRetrait(LocalTime.of(14, 30));
        delivery.setPhone("5141234567");
        delivery.setNote("Laisser à la porte");
        delivery.setAdresse(adresse);

        Commande commande = new Commande();
        commande.setPaymentMethod(PaymentMethod.EN_LIGNE);
        commande.setDelivery(delivery); // c’est une commande de livraison
        commande.setConfirmationCode(null); // encore non payée

        Panier panier = new Panier();
        panier.setId(panierId);

        List<Panier> paniers = List.of(panier);

        // Mock
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(panierRepository.findByUserIdWithCommandes(user.getId())).thenReturn(paniers);
        when(commandeRepository.findByPanier_IdAndConfirmationCodeIsNull(panierId)).thenReturn(Optional.of(commande));

        // Act
        List<DeliveryCommandeDTO> result = userService.findDeliveryOrdersByClientEmail(email);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        DeliveryCommandeDTO dto = result.get(0);
        assertEquals(panierId, dto.getPanierId());
        assertEquals("5141234567", dto.getPhone());
        assertEquals("Laisser à la porte", dto.getNote());
        assertEquals("EN_LIGNE", dto.getPaymentMethod());
        assertNotNull(dto.getAdresseDTO());
        assertEquals("123 Rue Test", dto.getAdresseDTO().getAdresse());

        // Verify mocks
        verify(userRepository).findByEmail(email);
        verify(panierRepository).findByUserIdWithCommandes(user.getId());
        verify(commandeRepository).findByPanier_IdAndConfirmationCodeIsNull(panierId);
    }

}