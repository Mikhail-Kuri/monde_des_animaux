import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutCard from "../../../Presentational Component/LogoutCard.js.jsx";

const ConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const locationState = location.state || {};
    const [formData, setFormData] = useState(locationState.formData || null);
    const [historiqueCommandes, setHistoriqueCommandes] = useState([]);
    const [selectedCommande, setSelectedCommande] = useState(null);

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
                if (data && data.length > 0) {
                    const last = data[data.length - 1];
                    setFormData(last);
                }
                setHistoriqueCommandes(data);
            })
            .catch(error => {
                console.error("❌ Erreur :", error.message);
            });
    }, []);

    if (!formData && !selectedCommande) {
        return (
            <div style={styles.container}>
                <h2>⏳ Chargement de votre confirmation...</h2>
                <p>Merci de patienter quelques secondes.</p>
            </div>
        );
    }

    const renderCommandeDetails = (commande) => (
        <>
            <h1 style={styles.title}>🎉 Détails de la commande</h1>
            <p style={styles.paragraph}>
                Voici votre <strong>code de confirmation</strong> :
            </p>
            <div style={styles.code}>
                {commande.confirmationCode || "Aucun code (paiement non finalisé)"}
            </div>

            <p style={styles.paragraph}>
                Présentez ce code lors du retrait en boutique.
                <br />
                📅 <strong>Date prévue :</strong> {commande.date || "Non spécifiée"}<br />
                ⏰ <strong>Heure estimée :</strong> {commande.time || "Non spécifiée"}<br />
                💳 <strong>Paiement :</strong> {
                commande.paymentMethod === "EN_LIGNE"
                    ? "En ligne"
                    : commande.paymentMethod === "MAISON"
                        ? "À la maison"
                        : "En magasin"
            }
                <br />
                📞 <strong>Téléphone :</strong> {commande.phone || "Non fourni"}<br />
                📝 <strong>Note :</strong> {commande.note || "Aucune"}
            </p>

        </>
    );

    return (
        <div style={styles.container}>
            <LogoutCard />

            {renderCommandeDetails(selectedCommande || formData)}

            <button style={styles.button} onClick={() => navigate("/userProducts")}>
                Retour à l'accueil
            </button>

            <h2 style={{ marginTop: "40px" }}>🧾 Historique de vos commandes</h2>
            {historiqueCommandes.length === 0 ? (
                <p>Aucune commande précédente trouvée.</p>
            ) : (
                <ul style={{ textAlign: "left", marginTop: "20px", padding: 0 }}>
                    {historiqueCommandes.map((cmd, index) => (
                        <li
                            key={index}
                            style={{ ...styles.commandItem, cursor: "pointer" }}
                            onClick={() => setSelectedCommande(cmd)}
                        >
                            ✅ <strong>{cmd.confirmationCode || "..."}</strong> - {cmd.date} à {cmd.time}
                            <br />
                            💳 {
                            cmd.paymentMethod === "EN_LIGNE"
                                ? "En ligne"
                                : cmd.paymentMethod === "MAISON"
                                    ? "À la maison"
                                    : "En magasin"
                        }
                            {cmd.note && <div>📝 {cmd.note}</div>}
                        </li>
                    ))}
                </ul>
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
        color: "#28a745",
        marginBottom: "20px"
    },
    paragraph: {
        fontSize: "1rem",
        marginBottom: "20px",
        lineHeight: "1.6"
    },
    code: {
        fontSize: "2rem",
        fontWeight: "bold",
        padding: "12px 20px",
        backgroundColor: "#e9f7ef",
        borderRadius: "8px",
        display: "inline-block",
        marginBottom: "30px",
        color: "#2e7d32"
    },
    button: {
        backgroundColor: "#ff8800",
        color: "#fff",
        padding: "12px 24px",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        marginBottom: "30px"
    },
    commandItem: {
        listStyle: "none",
        marginBottom: "16px",
        backgroundColor: "#f4f4f4",
        padding: "10px 15px",
        borderRadius: "8px"
    }
};

export default ConfirmationPage;
