import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import BackButton from "../../../Presentational Component/BackButton";


const PaiementEnAttentePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {payment} = location.state || {};
    const [userCart, setUserCart] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 👈 nouvel état de loading
    const [paymentInfo, setPaymentInfo] = useState(null); // pour fallback

    const calculerTotal = () => {
        if (!userCart) return {subtotal: 0, tps: 0, tvq: 0, total: 0};

        const subtotal = userCart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        const tps = subtotal * 0.05;
        const tvq = subtotal * 0.09975;
        const total = subtotal + tps + tvq;

        return {
            subtotal: subtotal.toFixed(2),
            tps: tps.toFixed(2),
            tvq: tvq.toFixed(2),
            total: total.toFixed(2),
        };
    };

    useEffect(() => {
        setPaymentInfo(payment?.[0] || null);
    }, []);

    const searchCartByToken = () => {
        const token = localStorage.getItem("token");
        setIsLoading(true); // 👈 commence le chargement
        fetch("http://localhost:8082/api/v1/commande/payments", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors de la récupération des commandes.");
                return response.json();
            })
            .then(data => {
                const fallbackPayment = data?.delivery?.[0] || data?.pickUp?.[0];
                if (fallbackPayment?.panierId) {
                    setPaymentInfo(fallbackPayment);
                }
            })
            .catch(error => {
                console.error("❌ Erreur :", error.message);
            })
            .finally(() => setIsLoading(false)); // 👈 termine le chargement
    };

    useEffect(() => {
        const panierId = payment?.[0]?.panierId || paymentInfo?.panierId;
        if (!panierId) {
            console.warn("Panier ID manquant ou invalide. Utilisation du token pour trouver le panier.");
            searchCartByToken();
            return;
        }

        const token = localStorage.getItem("token");
        setIsLoading(true); // 👈 commence le chargement

        fetch(`http://localhost:8082/api/v1/cart/${panierId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors de la récupération du panier.");
                return response.json();
            })
            .then(data => {
                setUserCart(data);
            })
            .catch(err => console.error(err.message))
            .finally(() => setIsLoading(false));
    }, [payment, paymentInfo]);

    return (
        <div style={styles.container}>
            <LogoutCard/>
            <h1 style={styles.title}>💳 Paiement en attente</h1>
            <p style={styles.paragraph}>
                Pour finaliser votre commande et recevoir votre <strong>code de confirmation</strong>,
                veuillez effectuer le paiement en ligne.
                <br/><br/>
                Une fois le paiement effectué, votre commande sera confirmée automatiquement.
            </p>

            <div style={styles.alert}>
                ⏳ En attendant, votre panier reste réservé pendant quelques minutes.
                <br/>
                <em>Si vous ne finalisez pas le paiement, la commande ne sera pas validée.</em>
            </div>

            {isLoading ? (
                <div style={{marginTop: "40px", fontSize: "1.1rem", color: "#888"}}>
                    ⏳ Chargement en cours...
                </div>
            ) : (
                <>
                    {userCart && (

                        <div style={styles.cartContainer}>
                            <h3 style={{marginBottom: "15px"}}>🧾 Contenu du panier :</h3>
                            {userCart.map((item, index) => (
                                <div key={index} style={styles.cartItem}>
                                    <div style={styles.itemLeft}>
                                        <span style={styles.itemName}>{item.productName}</span>
                                        <span style={styles.itemQuantity}>× {item.quantity}</span>
                                    </div>
                                    <div style={styles.itemPrice}>
                                        {(item.price * item.quantity).toFixed(2)} $
                                    </div>
                                </div>
                            ))}
                            <div style={styles.total}>
                                <BackButton to="/userProducts" label="← Retour" />
                                {(() => {
                                    const {subtotal, tps, tvq, total} = calculerTotal();
                                    return (
                                        <>
                                            <div>Sous-total : <strong>{subtotal} $</strong></div>
                                            <div>TPS (5%) : <strong>{tps} $</strong></div>
                                            <div>TVQ (9.975%) : <strong>{tvq} $</strong></div>
                                            <div style={{marginTop: "10px"}}>
                                                Total avec taxes : <strong>{total} $</strong>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                    )}
                    <div style={styles.buttonGroup}>

                        <button
                            style={styles.button}
                            onClick={() => {
                                const {total} = calculerTotal();
                                navigate("/payment-page", {state: {total, userCart, paymentInfo}});
                            }}
                        >
                            Payer
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#fefefe",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "'Inter', sans-serif"
    },
    title: {
        fontSize: "2rem",
        color: "#e67e22",
        marginBottom: "20px"
    },
    paragraph: {
        fontSize: "1rem",
        marginBottom: "20px",
        lineHeight: "1.6"
    },
    alert: {
        backgroundColor: "#fff3cd",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid #ffeeba",
        marginBottom: "30px",
        fontSize: "0.95rem"
    },
    button: {
        backgroundColor: "#ff8800",
        color: "#fff",
        padding: "12px 24px",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease"
    },
    cartContainer: {
        marginTop: "30px",
        textAlign: "left",
        backgroundColor: "#fafafa",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #eee"
    },
    cartItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #ddd",
        fontSize: "0.95rem"
    },
    itemLeft: {
        display: "flex",
        gap: "10px",
        alignItems: "center"
    },
    itemName: {
        fontWeight: "bold",
        color: "#333"
    },
    itemQuantity: {
        fontStyle: "italic",
        color: "#777"
    },
    itemPrice: {
        fontWeight: "bold",
        color: "#444"
    },
    total: {
        marginTop: "15px",
        textAlign: "right",
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#222"
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginTop: "30px"
    }
};

export default PaiementEnAttentePage;
