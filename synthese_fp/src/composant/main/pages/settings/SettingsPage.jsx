import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import BackButton from "../../../Presentational Component/BackButton";
const SettingsPage = () => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    // const handleBack = () => {
    //     navigate("/dashboard");
    // };
    return (
        <div style={{
            padding: "40px",
            textAlign: "center",
            background: "linear-gradient(to right, #fce4ec, #e8eaf6)",
            minHeight: "100vh"
        }}>
            <BackButton to="/dashboard" label="← Retour" />
            <h1 style={{fontSize: "2.5rem", color: "#6a1b9a", marginBottom: "20px"}}>
                ⚙️ Paramètres
            </h1>
            <p style={{fontSize: "1.2rem", color: "#555"}}>
                Cette page sera bientôt remplie avec des options pour personnaliser votre expérience.
            </p>
            <LogoutCard/>
        </div>

    );
};

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
        zIndex: 10,
    },
    backArrowHover: {
        backgroundColor: "#fff3e0",
        transform: "scale(1.07)",
    },
}

export default SettingsPage;
