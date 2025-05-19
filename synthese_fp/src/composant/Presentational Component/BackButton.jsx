// BackButton.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
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
        zIndex: 1001,
    },
    backArrowHover: {
        backgroundColor: "#fff3e0",
        transform: "scale(1.07)",
    },
};

const BackButton = ({ to = -1, label = "← Retour" }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleBack = () => {
        navigate(to); // Si `to` est -1, retourne en arrière dans l'historique
    };

    return (
        <div
            style={{
                ...styles.backArrow,
                ...(isHovered ? styles.backArrowHover : {}),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleBack}
            title="Retour"
        >
            {label}
        </div>
    );
};

export default BackButton;
