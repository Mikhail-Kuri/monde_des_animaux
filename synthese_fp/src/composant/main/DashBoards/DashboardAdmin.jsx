import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import LogoutCard from "../../Presentational Component/LogoutCard.js.jsx";
import "../CSS/style.css";
import BackButton from "../../Presentational Component/BackButton";

const petsImage = `${process.env.PUBLIC_URL}/imgs/pets.jpg`;
const groomingImage = `${process.env.PUBLIC_URL}/imgs/toilette.jpg`;
const deliveryImage = `${process.env.PUBLIC_URL}/imgs/livraison.jpg`;


;

const generateCircles = (numCircles) => {
    return Array.from({ length: numCircles }, (_, index) => ({
        id: index,
        size: Math.random() * 80 + 30, // Taille entre 30px et 110px (plus petit pour mobile)
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2
    }));
};

const DashboardAdmin = ({ user }) => {

    const [hoveredCard, setHoveredCard] = useState(null);
    const [circles] = useState(generateCircles(10));
    const navigate = useNavigate();
    const token = localStorage.getItem("token");


    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleChangePage = async (page) => {
        try {
            const response = await fetch(`http://localhost:8082/api/v1/user/admin/${page}Page`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401 || response.status === 403) {
                return; // Arrêter ici pour éviter un appel `json()` sur une réponse vide
            }

            const data = await response.json();

            if (data) {
                navigate(`/${page}`, { state: { data } });
            } else {
                console.error("Aucune donnée récupérée pour la page:", page);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la page :", error);
        }
    };



    return (
        <div style={styles.container}>

            <BackButton to="/login" label="← Retour" onClick={handleLogout} />
            {circles.map(circle => (
                <div
                    key={circle.id}
                    style={{
                        ...styles.circle,
                        width: `${circle.size}px`,
                        height: `${circle.size}px`,
                        top: `${circle.top}%`,
                        left: `${circle.left}%`,
                        opacity: circle.opacity
                    }}
                />
            ))}

            <h1 style={styles.title}>Bienvenue {user.firstName}</h1>
            <p style={styles.message}>{"Voici votre tableau de bord!" || "Loading..."}</p>

            <div style={styles.cardsContainer}>
                <div
                    style={{
                        ...styles.card,
                        ...(hoveredCard === "produits" ? styles.cardHoverEffect : {}),
                        backgroundImage: `url(${petsImage})`
                    }}
                    onMouseEnter={() => setHoveredCard("produits")}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleChangePage("products")}
                >
                    <h2 style={styles.cardTitle}>Produits</h2>
                    <p style={styles.cardDescription}>Gérer tous les produits du magasin</p>
                </div>

                {/*<div*/}
                {/*    style={{*/}
                {/*        ...styles.card,*/}
                {/*        ...(hoveredCard === "toilettage" ? styles.cardHoverEffect : {}),*/}
                {/*        backgroundImage: `url(${groomingImage})`*/}
                {/*    }}*/}
                {/*    onMouseEnter={() => setHoveredCard("toilettage")}*/}
                {/*    onMouseLeave={() => setHoveredCard(null)}*/}
                {/*    onClick={() => handleChangePage("grooming")}*/}
                {/*>*/}
                {/*    <h2 style={styles.cardTitle}>Toilettage</h2>*/}
                {/*    <p>Gérer tous les services de toilettage</p>*/}
                {/*</div>*/}

                <div
                    style={{
                        ...styles.card,
                        ...(hoveredCard === "commande" ? styles.cardHoverEffect : {}),
                        backgroundImage: `url(${deliveryImage})`
                    }}
                    onMouseEnter={() => setHoveredCard("commande")}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleChangePage("orders")}
                >
                    <h2 style={styles.cardTitle}>Commande et Livraison</h2>
                    <p style={styles.cardDescription}>Suivre et gérer les commandes et livraisons</p>
                </div>
            </div>
            <div>
                <LogoutCard/>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(to right, #ffe0b2, #e1f5fe)",
        position: "relative",
        overflow: "hidden"
    },
    circle: {
        position: "absolute",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 165, 0, 0.3)",
        filter: "blur(12px)",
        animation: "float 10s ease-in-out infinite alternate",
        zIndex: 0,
        transition: "transform 0.5s ease-in-out"
    },
    title: {
        fontSize: "2.8rem",
        fontWeight: "700",
        marginBottom: "10px",
        position: "relative",
        zIndex: 1,
        color: "#333",
        textAlign: "center"
    },
    message: {
        marginBottom: "30px",
        fontSize: "1.2rem",
        color: "#555",
        position: "relative",
        zIndex: 1,
        textAlign: "center"
    },
    cardsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "30px",
        width: "90%",
        maxWidth: "1200px",
        position: "relative",
        zIndex: 1,
    },
    card: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        textAlign: "center",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        minHeight: "220px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        textShadow: "1px 1px 6px rgba(0,0,0,0.6)",
        transition: "transform 0.4s ease, box-shadow 0.4s ease",
        position: "relative",
        zIndex: 2
    },
    cardHoverEffect: {
        transform: "scale(1.07)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
    },
    cardTitle: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "10px"
    },
    cardDescription: {
        fontSize: "1rem",
        color: "white",
        textAlign: "center"
    }
};


DashboardAdmin.propTypes = {
    user: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired
};

export default DashboardAdmin;
