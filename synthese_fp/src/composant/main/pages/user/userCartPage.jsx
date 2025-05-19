import React, {useState, useEffect} from 'react';
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import {useNavigate} from "react-router-dom";
import BackButton from "../../../Presentational Component/BackButton";


const UserCartPage = () => {
    const [userCart, setUserCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const subtotal = userCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tps = subtotal * 0.05;
    const tvq = subtotal * 0.09975;
    const totalT = subtotal + tps + tvq;


    // const handleBack = () => {
    //     navigate("/userProducts");
    // };

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
                setLoading(false);
            })
            .catch(err => {
                console.error(err.message);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const total = userCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    function handleLivraison() {


    }

    return (
        <div style={styles.container}>
            <BackButton to="/userProducts" label="← Retour" />
            <h2 style={styles.title}>🛒 Mon Panier</h2>

            {loading ? (
                <p style={styles.message}>Chargement...</p>
            ) : error ? (
                <p style={{...styles.message, color: "red"}}>Erreur : {error}</p>
            ) : userCart.length === 0 ? (
                <p style={styles.message}>Votre panier est vide.</p>
            ) : (
                <>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>Produit</th>
                            <th style={styles.th}>Quantité</th>
                            <th style={styles.th}>Prix unitaire</th>
                            <th style={styles.th}>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userCart.map((item, index) => (
                            <tr key={index} style={styles.tr}>
                                <td style={styles.td}>{item.productName}</td>
                                <td style={styles.td}>{item.quantity}</td>
                                <td style={styles.td}>{item.price.toFixed(2)} $</td>
                                <td style={styles.td}>{(item.price * item.quantity).toFixed(2)} $</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr style={styles.totalRow}>
                            <td colSpan="3" style={styles.totalLabel}>Sous-total :</td>
                            <td style={styles.totalValue}>{subtotal.toFixed(2)} $</td>
                        </tr>
                        <tr style={styles.totalRow}>
                            <td colSpan="3" style={styles.totalLabel}>TPS (5%) :</td>
                            <td style={styles.totalValue}>{tps.toFixed(2)} $</td>
                        </tr>
                        <tr style={styles.totalRow}>
                            <td colSpan="3" style={styles.totalLabel}>TVQ (9.975%) :</td>
                            <td style={styles.totalValue}>{tvq.toFixed(2)} $</td>
                        </tr>
                        <tr style={styles.totalRow}>
                            <td colSpan="3" style={styles.totalLabel}>Total TTC :</td>
                            <td style={{
                                ...styles.totalValue,
                                fontSize: "1.2rem",
                                fontWeight: "bold"
                            }}>{totalT.toFixed(2)} $
                            </td>
                        </tr>
                        </tfoot>

                    </table>
                    <div style={styles.buttonGroup}>
                        <button
                            style={{
                                ...styles.orderButton,
                                ...(hoveredButton === 'pickup' ? styles.orderButtonHover : {})
                            }}
                            onMouseEnter={() => setHoveredButton('pickup')}
                            onMouseLeave={() => setHoveredButton(null)}
                            onClick={() => navigate("/pickup-info")}
                        >
                            🏬 Pick-up en magasin
                        </button>

                        <button
                            style={{
                                ...styles.orderButton,
                                ...(hoveredButton === 'delivery' ? styles.orderButtonHover : {})
                            }}
                            onMouseEnter={() => setHoveredButton('delivery')}
                            onMouseLeave={() => setHoveredButton(null)}
                            onClick={() => navigate("/livraison_info")}
                        >
                            🚚 Réserver pour livraison
                        </button>

                        {/*<button*/}
                        {/*    style={{*/}
                        {/*        ...styles.orderButton,*/}
                        {/*        ...(hoveredButton === 'pay' ? styles.orderButtonHover : {})*/}
                        {/*    }}*/}
                        {/*    onMouseEnter={() => setHoveredButton('pay')}*/}
                        {/*    onMouseLeave={() => setHoveredButton(null)}*/}
                        {/*    onClick={() => alert("Paiement en cours...")}*/}
                        {/*>*/}
                        {/*    💳 Payer*/}
                        {/*</button>*/}
                    </div>


                    <LogoutCard/>

                </>
            )}


        </div>

    );
};

const styles = {
    container: {
        padding: "60px 40px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
    },
    title: {
        textAlign: "center",
        fontSize: "2.4rem",
        marginBottom: "40px",
        color: "#333",
    },
    message: {
        textAlign: "center",
        fontSize: "1.2rem",
        marginTop: "30px",
        color: "#666",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    },
    th: {
        backgroundColor: "#ff8800",
        color: "#fff",
        padding: "18px",
        textAlign: "left",
        fontSize: "1rem",
        fontWeight: 600,
    },
    td: {
        padding: "18px",
        borderBottom: "1px solid #f0f0f0",
        fontSize: "1rem",
        color: "#444",
    },
    tr: {
        transition: "background-color 0.25s ease",
    },
    totalRow: {
        backgroundColor: "#fafafa",
        fontWeight: "bold",
    },
    totalLabel: {
        textAlign: "right",
        padding: "18px",
        fontSize: "1.1rem",
    },
    totalValue: {
        padding: "18px",
        fontSize: "1.1rem",
        color: "#219653",
    },
    backArrow: {
        position: "absolute",
        top: "20px",
        left: "20px",
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
    orderButton: {
        marginTop: "30px",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#ff8800",
        color: "#fff",
        padding: "12px 28px",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "background-color 0.3s ease",
    },
    orderButtonHover: {
        backgroundColor: "#e67600",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "30px",
        flexWrap: "wrap",
    },

};


export default UserCartPage;
