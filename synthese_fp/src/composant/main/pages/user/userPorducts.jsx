import React, {useState, useEffect} from 'react';
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import {useNavigate} from "react-router-dom";
import BackButton from "../../../Presentational Component/BackButton";


const UserProducts = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("TOUS");
    const [sortOrder, setSortOrder] = useState("");
    const [modalImage, setModalImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCardId, setHoveredCardId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [userCart, setUserCart] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [commandes, setCommandes] = useState([]);
    const [payments, setPayments] = useState([]);
    const [canHaveCart, setCanHaveCart] = useState(true);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleBack = () => {
        navigate("/dashboard");
    };


    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:8082/api/v1/cart", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors de la récupération du panier.");
                return response.json();
            })
            .then(data => {
                setUserCart(data.lignePaniers || []);
            })
            .catch(err => console.error(err.message + canHaveCart + " (Peut-être pas de panier)"));
    }, []);



    // Load products
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:8082/api/v1/product/all", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors du chargement des produits.");
                return response.json();
            })
            .then(data => {
                setAllProducts(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:8082/api/v1/commande/client", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors de la récupération des commandes.");
                return response.json();
            })
            .then(data => {
                setCommandes(data);
            })
            .catch(error => {
                console.error("❌ Erreur :", error.message);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:8082/api/v1/commande/payments", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors de la récupération des commandes.");
                return response.json();
            })
            .then(data => {
                const pickUp = data.pickUp;
                const delivery = data.delivery;
                if (pickUp.length > 0 || delivery.length > 0) {
                    setCanHaveCart(false);
                }
                setPayments(delivery.length > 0 ? delivery : pickUp);
            })
            .catch(error => {
                console.error("❌ Erreur :", error.message);
            });
    }, []);


    // Filter, search, sort
    useEffect(() => {
        let filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedCategory !== "TOUS") {
            filtered = filtered.filter(product =>
                product.category?.toUpperCase() === selectedCategory
            );
        }

        if (sortOrder) {
            filtered.sort((a, b) => {
                if (sortOrder === "price-asc") return a.price - b.price;
                if (sortOrder === "price-desc") return b.price - a.price;
                if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
                if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
                return 0;
            });
        }

        setProducts(filtered);
    }, [searchTerm, selectedCategory, sortOrder, allProducts]);

    const handleCartClick = () => {
        const token = localStorage.getItem("token");

        if (!userCart || userCart.length === 0 || !canHaveCart) {

        } else {
            navigate("/userCart");
        }
    };

    const handleCommandesClick = () => {
        if (commandes.length > 0) {
            navigate("/confirmation");
        }

    };

    const handleAddToCart = (selectedProduct) => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:8082/api/v1/cart/add", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: selectedProduct.id,
                quantity: 1
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(msg => {
                        throw new Error(msg);
                    });
                }
                return response.json();
            })
            .then(addedItem => {
                // Met à jour le panier local
                setUserCart(prevCart => {
                    const currentCart = Array.isArray(prevCart) ? [...prevCart] : [];

                    const existingIndex = currentCart.findIndex(item => item.productId === addedItem.productId);
                    if (existingIndex !== -1) {
                        currentCart[existingIndex] = {
                            ...currentCart[existingIndex],
                            quantity: addedItem.quantity
                        };
                    } else {
                        currentCart.push(addedItem);
                    }

                    return currentCart;
                });
                setShowSuccessModal(true);
                setTimeout(() => setShowSuccessModal(false), 2000);
                setSelectedProduct(null);
            })
            .catch(err => {
                alert("❌ Erreur : " + err.message);
            });
    };


    const dynamicCartStyle = {
        ...styles.cartIcon,
        backgroundColor: userCart?.length > 0 && canHaveCart ? "#fff" : "#eee",
        borderColor: userCart?.length > 0 && canHaveCart ? "orange" : "#ccc",
        animation: userCart?.length > 0 && canHaveCart ? "shine 2s infinite linear" : "none",
        cursor: userCart?.length > 0 && canHaveCart ? "pointer" : "not-allowed",
        transform: userCart?.length > 0 && canHaveCart ? "scale(1.05)" : "none",
    };
    const dynamicCommandeStyle = {
        ...styles.actionIcon,
        backgroundColor: commandes.length > 0 ? "#fff" : "#eee",
        border: `2px solid ${commandes.length > 0 ? "orange" : "#ccc"}`,
        cursor: commandes.length > 0 ? "pointer" : "not-allowed",
        transform: commandes.length > 0 ? "scale(1.05)" : "none",
        opacity: commandes.length > 0 ? 1 : 0.6,
        animation: commandes.length > 0 ? "shine 2s infinite linear" : "none",
    };

    const dynamicPaymentStyle = {
        ...styles.actionIcon,
        backgroundColor: payments.length > 0 ? "#fff" : "#eee",
        border: `2px solid ${payments.length > 0 ? "blue" : "#ccc"}`,
        cursor: payments.length > 0 ? "pointer" : "not-allowed",
        transform: payments.length > 0 ? "scale(1.05)" : "none",
        opacity: payments.length > 0 ? 1 : 0.6,
        animation: payments?.length > 0 ? "shineB 2s infinite linear" : "none",
    };


    // Inject the shine animation keyframes (1 fois)
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
        @keyframes shine {
            0% { box-shadow: 0 0 5px rgba(255, 165, 0, 0.7); }
            50% { box-shadow: 0 0 15px rgba(255, 165, 0, 1); }
            100% { box-shadow: 0 0 5px rgba(255, 165, 0, 0.7); }
        }
        
        @keyframes shineB {
            0% { box-shadow: 0 0 5px rgba(0, 0, 255, 0.7); }
            50% { box-shadow: 0 0 15px rgba(0, 0, 255, 1); }
            100% { box-shadow: 0 0 5px rgba(0, 0, 255, 0.7); }
        }

        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
        document.head.appendChild(style);

        // Nettoyage éventuel (optionnel)
        return () => {
            document.head.removeChild(style);
        };
    }, []);


    function handlePaymentsClick() {
        navigate("/paiement-en-attente", {
            state: {payment: payments}
        });
    }

    return (
        <div style={styles.container}>
            <BackButton to="/dashboard" label="← Retour"/>
            {/* Panier */}
            <div style={{
                position: 'fixed',
                top: '2px',
                right: '165px',
                display: 'flex',
                flexDirection: 'row',
                gap: '15px',
                zIndex: 1000
            }}>
                <div
                    style={dynamicCartStyle}
                    onClick={handleCartClick}

                    onMouseOver={(e) => {
                        if (userCart.length > 0 && canHaveCart) e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseOut={(e) => {
                        if (userCart.length > 0 && canHaveCart) e.currentTarget.style.transform = "scale(1)";
                    }}
                    title={userCart ? "Voir le panier" : "Panier vide"}
                >
                    🛒
                    {userCart && userCart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                        <div style={styles.cartBadge}>
                            {userCart.reduce((sum, item) => sum + item.quantity, 0)}
                        </div>
                    )}
                </div>

                {/* Icônes commandes et paiements en haut à gauche sous le panier */}

                <div
                    style={dynamicCommandeStyle}
                    onMouseOver={(e) => {
                        if (commandes.length > 0) e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseOut={(e) => {
                        if (commandes.length > 0) e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onClick={commandes.length > 0 ? handleCommandesClick : null}
                    title={commandes.length === 0 ? "Aucune commande trouvée" : "Voir mes commandes"}
                >
                    📦
                    {commandes.length > 0 && (
                        <div style={styles.cartBadge}>
                            {commandes.length}
                        </div>
                    )}
                </div>

                <div
                    style={dynamicPaymentStyle}
                    onMouseOver={(e) => {
                        if (payments.length > 0) e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseOut={(e) => {
                        if (payments.length > 0) e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onClick={payments.length > 0 ? handlePaymentsClick : null}
                    title={payments.length === 0 ? "Aucun paiement trouvé" : "Voir mes paiements"}
                >
                    💳
                    {payments.length > 0 && (
                        <div style={styles.cartBadge}>
                            {payments.length}
                        </div>
                    )}
                </div>

            </div>


            <h2 style={styles.title}>🛍️ Nos Produits</h2>

            {loading ? (
                <p style={{textAlign: "center"}}>Chargement des produits...</p>
            ) : error ? (
                <p style={{textAlign: "center", color: "red"}}>{error}</p>
            ) : (
                <>
                    <div style={styles.controls}>
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select style={styles.sortSelect} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="">Trier par</option>
                            <option value="price-asc">Prix : Bas → Haut</option>
                            <option value="price-desc">Prix : Haut → Bas</option>
                            <option value="name-asc">Nom : A → Z</option>
                            <option value="name-desc">Nom : Z → A</option>
                        </select>
                    </div>

                    <div style={styles.categories}>
                        {["TOUS", "CHIEN", "CHAT", "OISEAU", "POISSON", "RONGEUR"].map((cat, i) => (
                            <button
                                key={`${cat}-${i}`}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    ...styles.categoryButton,
                                    backgroundColor: selectedCategory === cat ? "orange" : "#fff"
                                }}
                            >
                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <div style={styles.grid}>
                        {products.length > 0 ? (
                            products
                            .filter(product => product.quantity > 0)
                                .map(product => (
                                <div
                                    key={product.id}
                                    style={{
                                        ...styles.card,
                                        ...(hoveredCardId === product.id ? styles.cardHover : {})
                                    }}
                                    onMouseEnter={() => setHoveredCardId(product.id)}
                                    onMouseLeave={() => setHoveredCardId(null)}
                                >
                                    <button
                                        style={canHaveCart ? styles.addToCartBtn : styles.addToCartBtnDisabled}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (canHaveCart) {
                                                setSelectedProduct(product);
                                            }
                                        }}
                                        title={canHaveCart ? "Ajouter au panier" : "Payement en attente"}
                                    >
                                        🛒+
                                    </button>
                                    <img
                                        src={product.imageBase64 ? `data:image/jpeg;base64,${product.imageBase64}` : "https://via.placeholder.com/150"}
                                        alt={product.name}
                                        style={styles.image}
                                        onClick={() => setModalImage(`data:image/jpeg;base64,${product.imageBase64}`)}
                                    />
                                    <h3 style={styles.productName}>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p style={styles.price}>{product.price} $</p>
                                </div>
                            ))
                        ) : (
                            <p style={{textAlign: "center", width: "100%"}}>Aucun produit à afficher.</p>
                        )}
                    </div>
                </>
            )}

            <LogoutCard/>

            {/* Zoom image */}
            {modalImage && (
                <div style={styles.modal} onClick={() => setModalImage(null)}>
                    <div style={styles.modalContent}>
                        <img src={modalImage} alt="Produit" style={styles.modalImage}/>
                    </div>
                </div>
            )}

            {/* Confirmation panier */}
            {selectedProduct && (
                <div style={styles.confirmModal} onClick={() => setSelectedProduct(null)}>
                    <div style={styles.confirmContent} onClick={(e) => e.stopPropagation()}>
                        <h3>Ajouter au panier ?</h3>
                        <p>{selectedProduct.name}</p>
                        <div style={styles.modalButtons}>
                            <button
                                style={{...styles.modalBtn, backgroundColor: "orange"}}
                                onClick={() => handleAddToCart(selectedProduct)}
                            >
                                Oui
                            </button>
                            <button
                                style={{...styles.modalBtn, backgroundColor: "orange"}}
                                onClick={() => setSelectedProduct(null)}
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div style={styles.successModal}>
                    <div style={styles.successModalContent}>
                        <div style={styles.checkmarkWrapper}>
                            <div style={styles.checkmark}></div>
                        </div>
                        <p>Produit ajouté au panier !</p>
                    </div>
                </div>
            )}

        </div>


    );


};

const styles = {
    container: {padding: "30px", fontFamily: "Arial, sans-serif"},
    title: {textAlign: "center", fontSize: "2rem", marginBottom: "20px"},
    controls: {display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px"},
    searchInput: {padding: "10px", fontSize: "1rem", width: "250px", borderRadius: "5px", border: "1px solid #ccc"},
    sortSelect: {padding: "8px", fontSize: "1rem", borderRadius: "5px", border: "1px solid #ccc"},
    categories: {display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px", marginBottom: "20px"},
    categoryButton: {
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        backgroundColor: "#fff"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
    },
    card: {
        position: "relative",
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
    },
    cardHover: {
        transform: "scale(1.03)",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)"
    },
    image: {
        width: "100%",
        height: "150px",
        objectFit: "cover",
        borderRadius: "10px",
        cursor: "zoom-in"
    },
    productName: {fontSize: "1.2rem", color: "#333"},
    price: {fontWeight: "bold", color: "green"},
    modal: {
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer"
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "30%", height: "50%",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "100%", maxHeight: "80%",
        display: "flex", justifyContent: "center", alignItems: "center"
    },
    modalImage: {maxWidth: "100%", maxHeight: "100%", borderRadius: "10px"},
    cartIcon: {
        position: "fixed",
        top: "2px",
        right: "350px",
        fontSize: "2rem",
        backgroundColor: "#fff",
        padding: "10px 15px",
        borderRadius: "50%",
        border: "2px solid orange",
        zIndex: 1000,
        transition: "transform 0.2s ease-in-out"
    },
    actionIcon: {
        fontSize: '2rem',
        backgroundColor: '#fff',
        padding: '10px 15px',
        borderRadius: '50%',
        zIndex: 1000,
        transition: 'transform 0.2s ease-in-out',
        textAlign: 'center'
    },
    orderIcon: {
        position: "fixed",
        top: "100px",
        left: "20px",
        fontSize: "2rem",
        backgroundColor: "#fff",
        padding: "10px 15px",
        borderRadius: "50%",
        border: "2px solid orange",
        zIndex: 1000,
        transition: "transform 0.2s ease-in-out"
    },
    paymentIcon: {
        position: "fixed",
        top: "200px",
        left: "20px",
        fontSize: "2rem",
        backgroundColor: "#fff",
        padding: "10px 15px",
        borderRadius: "50%",
        border: "2px solid blue",
        zIndex: 1000,
        transition: "transform 0.2s ease-in-out"
    },
    iconBase: {
        fontSize: '1.8rem',
        backgroundColor: '#fff',
        padding: "10px 15px",
        borderRadius: "50%",
        transition: "transform 0.2s ease-in-out",
        textAlign: "center"
    },
    addToCartBtn: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "orange",
        border: "none",
        color: "white",
        padding: "5px 10px",
        borderRadius: "50%",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "1rem",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)"
    },
    addToCartBtnDisabled: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#ccc",        // gris clair
        border: "none",
        color: "#666",                  // texte plus terne
        padding: "5px 10px",
        borderRadius: "50%",
        cursor: "not-allowed",          // curseur désactivé
        fontWeight: "bold",
        fontSize: "1rem",
        boxShadow: "none",              // pas d’ombre pour signaler l’inactivité
        opacity: 0.7,                   // légèrement transparent
        pointerEvents: "none",          // empêche tout clic
    },
    confirmModal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999
    },
    confirmContent: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center",
        minWidth: "300px"
    },
    modalButtons: {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "20px"
    },
    modalBtn: {
        padding: "10px 20px",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    successModal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    },
    successModalContent: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center",
        animation: "fadeInScale 0.3s ease-out"
    },
    checkmarkWrapper: {
        width: "60px",
        height: "60px",
        margin: "0 auto 10px",
        borderRadius: "50%",
        backgroundColor: "lightgreen",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    checkmark: {
        width: "20px",
        height: "10px",
        borderLeft: "4px solid white",
        borderBottom: "4px solid white",
        transform: "rotate(-45deg)"
    },
    "@keyframes fadeInScale": `
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
`,
    cartBadge: {
        position: "absolute",
        top: "-5px",
        right: "-5px",
        backgroundColor: "red",
        color: "white",
        borderRadius: "50%",
        padding: "2px 6px",
        fontSize: "0.8rem",
        fontWeight: "bold",
        boxShadow: "0 0 5px rgba(0,0,0,0.3)"
    },
    backArrow: {
        position: "absolute",
        top: "20px",
        left: "120px",
        fontSize: "1rem",
        color: "#ff8800",
        backgroundColor: "#fff",
        padding: "10px 16px",
        borderRadius: "30px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 0.25s ease",
        fontWeight: 600,
        zIndex: 10,
    },
    backArrowHover: {
        backgroundColor: "#fff3e0",
        transform: "scale(1.07)",
    },

};

export default UserProducts;
