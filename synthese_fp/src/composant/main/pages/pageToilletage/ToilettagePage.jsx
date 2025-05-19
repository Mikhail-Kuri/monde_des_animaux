import React, { useRef } from 'react';
import BackButton from "../../../Presentational Component/BackButton";
import LogoutCard from "../../../Presentational Component/LogoutCard.js";

const ToilettagePage = () => {
    const aboutRef = useRef(null);
    const servicesRef = useRef(null);
    const contactRef = useRef(null); // <-- nouveau ref pour footer

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{
            padding: "40px",
            background: "linear-gradient(to right, #e0f7fa, #fff8e1)",
            minHeight: "100vh"
        }}>
            <BackButton to="/dashboard" label="← Retour" />
            <LogoutCard/>

            <h1 style={{ fontSize: "3rem", color: "#333", textAlign: "center", marginBottom: "20px" }}>
                🛁 Service de toilettage
            </h1>

            {/* Boutons de navigation */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginBottom: "40px"
            }}>
                <button
                    onClick={() => scrollToSection(aboutRef)}
                    style={buttonStyle}
                >
                    À propos
                </button>
                <button
                    onClick={() => scrollToSection(servicesRef)}
                    style={buttonStyle}
                >
                    Services & Tarifs
                </button>
                <button
                    onClick={() => scrollToSection(contactRef)}
                    style={buttonStyle}
                >
                    Contactez-nous
                </button>

            </div>

            {/* SECTION À PROPOS */}
            <section ref={aboutRef} style={sectionStyle}>
                <h2 style={{fontSize: "2rem", color: "#00796b", marginBottom: "20px"}}>À propos de nous</h2>
                <p>
                    L'aventure de <strong>Monde Des Animaux</strong> a commencé en 2014 lorsqu’un jeune entrepreneur passionné par les animaux a décidé d’ouvrir une boutique sur l’Île-des-Sœurs.
                </p>
                <p>
                    Tout le monde sait que l’Île-des-Sœurs est un endroit exceptionnel pour vivre avec des animaux de compagnie : de nombreux parcs, une nature abondante et des sentiers paisibles pour partager de merveilleux moments avec votre chien ou votre chat.
                </p>
                <p>
                    Après avoir obtenu son diplôme universitaire, il était temps de signer les papiers et de ne plus jamais regarder en arrière...
                </p>
                <p>
                    Aujourd’hui, <strong>Monde Des Animaux</strong> ne propose pas seulement les marques d’aliments les plus réputées, mais aussi des services de <strong>toilettage</strong> et de <strong>garderie</strong> pour vos compagnons à quatre pattes.
                </p>
            </section>

            {/* SECTION SERVICES ET PRIX */}
            <section ref={servicesRef} style={sectionStyle}>
                <h2 style={{ fontSize: "2rem", color: "#ff6f00", marginBottom: "20px" }}>Nos services & tarifs</h2>
                <p style={{ marginBottom: "20px" }}>
                    Voici un aperçu des services de toilettage que nous offrons pour différentes races et tailles d’animaux :
                </p>

                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "1rem"
                }}>
                    <thead>
                    <tr style={{ backgroundColor: "#ffe0b2" }}>
                        <th style={cellStyle}>Type d'animal</th>
                        <th style={cellStyle}>Service</th>
                        <th style={cellStyle}>Prix</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={cellStyle}>Petit chien</td>
                        <td style={cellStyle}>Toilettage complet</td>
                        <td style={cellStyle}>À partir de 55 $</td>
                    </tr>
                    <tr style={{backgroundColor: "#f9f9f9"}}>
                        <td style={cellStyle}>Chien moyen</td>
                        <td style={cellStyle}>Toilettage complet</td>
                        <td style={cellStyle}>À partir de 70 $</td>
                    </tr>
                    <tr>
                        <td style={cellStyle}>Grand chien</td>
                        <td style={cellStyle}>Toilettage complet</td>
                        <td style={cellStyle}>À partir de 85 $</td>
                    </tr>
                    <tr style={{backgroundColor: "#f9f9f9"}}>
                        <td style={cellStyle}>Chat</td>
                        <td style={cellStyle}>Toilettage (brossage + coupe griffes)</td>
                        <td style={cellStyle}>À partir de 60 $</td>
                    </tr>
                    <tr style={{backgroundColor: "#f9f9f9"}}>
                        <td style={cellStyle}>Chien</td>
                        <td style={cellStyle}>Glande</td>
                        <td style={cellStyle}>15 $</td>
                    </tr>
                    <tr>
                        <td style={cellStyle}>Tous</td>
                        <td style={cellStyle}>Coupe de griffes uniquement</td>
                        <td style={cellStyle}>11.99 $</td>
                    </tr>
                    </tbody>
                </table>
            </section>

            <footer ref={contactRef} style={footerStyle}>
                <h3 style={{color: "#00796b", marginBottom: "15px"}}>Contactez-nous</h3>
                <p style={{fontStyle: "italic", marginBottom: "20px", color: "#004d40"}}>
                    N’hésitez pas à nous contacter pour toute question ou demande d’information.
                    Nous sommes là pour vous aider et assurer le bien-être de vos compagnons à quatre pattes.
                </p>
                <p>📧 mdanimaux@gmail.com</p>
                <p>📞 +1 514-357-4150</p>
                <p>📍 38 Place Du Commerce, Verdun
                    Quebec H3E 1T8</p>
            </footer>

        </div>

    );
};

// Styles
const cellStyle = {
    border: "1px solid #ccc",
    padding: "12px",
    textAlign: "left"
};

const buttonStyle = {
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    fontSize: "1rem",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
};

const sectionStyle = {
    maxWidth: "900px",
    margin: "0 auto 60px auto",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
};

const footerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px 30px",
    backgroundColor: "#e0f7fa",
    borderRadius: "15px",
    boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
    color: "#004d40",
    fontSize: "1.1rem"
};


export default ToilettagePage;
