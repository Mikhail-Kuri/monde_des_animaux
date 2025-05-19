package com.MikeCom.SystheseP.config;

import com.MikeCom.SystheseP.model.Product;
import com.MikeCom.SystheseP.model.Enum.Category;
import com.MikeCom.SystheseP.model.Enum.Brand;
import com.MikeCom.SystheseP.repository.ProductRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Configuration
public class ProductInitializer {

    private byte[] readImage(String fileName) {
        try {
            Path imagePath = Path.of("src/main/resources/static/uploads/", fileName);
            return Files.readAllBytes(imagePath);
        } catch (IOException e) {
            System.err.println("⚠️ Impossible de lire l'image " + fileName);
            return null;
        }
    }

    @Bean
    public ApplicationRunner initProducts(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                List<Product> products = List.of(
                        new Product("Croquettes Premium ", "Alimentation pour chien adulte", Category.CHIEN, 25.99, 0, readImage("croquettes_premium.jpg"), Brand.ROYAL_CANIN, 2.5),
                        new Product("Jouet en Caoutchouc", "Jouet résistant pour chiens", Category.CHIEN, 12.50, 30, readImage("jouet_caoutchouc.jpg"), Brand.PROPLAN, 0.3),
                        new Product("Litière pour Chat", "Litière absorbante sans odeur", Category.CHAT, 18.99, 20, readImage("litiere_chat.jpg"), Brand.PURINA, 5.0),
                        new Product("Arbre à Chat", "Arbre à chat avec griffoir", Category.CHAT, 79.99, 10, readImage("arbre_chat.jpg"), Brand.HILLS, 12.0),
                        new Product("Nourriture pour Poisson", "Flocons alimentaires pour poissons tropicaux", Category.POISSON, 9.99, 100, readImage("nourriture_poisson.jpg"), Brand.TETRA, 0.5),
                        new Product("Aquarium 50L", "Aquarium en verre avec filtre intégré", Category.POISSON, 119.99, 5, readImage("aquarium.jpg"), Brand.FLUVAL, 15.0),
                        new Product("Cage pour Oiseau", "Grande cage pour perruches", Category.OISEAU, 89.99, 7, readImage("cage_oiseau.jpg"), Brand.HAGEN, 6.5),
                        new Product("Mélange de Graines", "Alimentation équilibrée pour oiseaux", Category.OISEAU, 14.99, 50, readImage("graines_oiseau.jpg"), Brand.VERSELE_LAGA, 1.0),
                        new Product("Foin Bio", "Foin pour rongeurs, riche en fibres", Category.RONGEUR, 10.99, 40, readImage("foin_rongeur.jpg"), Brand.OXBOW, 2.0),
                        new Product("Cage pour Hamster", "Cage spacieuse avec accessoires", Category.RONGEUR, 49.99, 15, readImage("cage_hamster.jpg"), Brand.VITAKRAFT, 3.5)
                );

                productRepository.saveAll(products);
                System.out.println("✅ 10 produits pré-créés avec images en BYTEA !");
            } else {
                System.out.println("🔄 Produits déjà existants en base.");
            }
        };
    }
}
