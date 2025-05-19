import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutCard from "../../Presentational Component/LogoutCard.js.jsx";
import BackButton from "../../Presentational Component/BackButton";

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [isHovered, setIsHovered] = useState(false);

    const handleChangePage = async (s) => {
        try {
            const response = await fetch(`http://localhost:8082/api/v1/user/user/${s}Page`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401 || response.status === 403) {

                return;
            }

            const data = await response.json();

            if (data) {
                navigate(`/${s}`, { state: { data } });
            } else {
                console.error("Aucune donnée récupérée pour la page:", s);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la page :", error);
        }
    };

    return (
        <div style={{
            padding: "40px",
            textAlign: "center",
            background: "linear-gradient(to right, #ffe6e6, #e6f7ff)",
            minHeight: "100vh"
        }}>

           <BackButton to="/login" label="← Retour" />
            <h1 style={{fontSize: "3rem", color: "#333", marginBottom: "10px"}}>🐾 Bienvenue sur votre espace !</h1>
            <p style={{fontSize: "1.2rem", color: "#666", marginBottom: "30px"}}>
                Heureux de vous revoir{user?.firstName ? `, ${user.firstName}` : ""} ! Que souhaitez-vous faire
                aujourd’hui ?
            </p>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "40px",
                marginTop: "40px",
                flexWrap: "wrap"
            }}>
                {/* Carte boutique */}
                <div style={{
                    border: "1px solid #ddd",
                    borderRadius: "15px",
                    padding: "25px",
                    width: "300px",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff3e0",
                    transition: "transform 0.3s",
                    cursor: "pointer"
                }}
                     onClick={() => handleChangePage("userProducts")}
                     onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                     onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                >
                    <h3 style={{color: "#e65100", fontSize: "1.5rem"}}>🛍️ Magasinez chez nous !!!</h3>
                    <p style={{color: "#444"}}>Découvrez des produits adorables et utiles pour vos compagnons.</p>
                    <button style={{
                        marginTop: "15px",
                        padding: "10px 18px",
                        backgroundColor: "#ff9800",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}>
                        Explorer la boutique
                    </button>
                </div>

                <div style={{
                    border: "1px solid #ddd",
                    borderRadius: "15px",
                    padding: "25px",
                    width: "300px",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#e3f2fd",
                    transition: "transform 0.3s",
                    cursor: "pointer"
                }}
                     onClick={() => navigate('/toilettage')}
                     onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                     onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                >
                    <h3 style={{color: "#1565c0", fontSize: "1.5rem"}}>🛁 Découvrez notre service toilettage</h3>
                    <p style={{color: "#444"}}>
                        Consultez les services offerts en magasin et les tarifs.
                    </p>
                    <button style={{
                        marginTop: "15px",
                        padding: "10px 18px",
                        backgroundColor: "#2196f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}>
                        En savoir plus
                    </button>
                </div>

                {/* Carte configuration des interactions */}
                {/*<div style={{*/}
                {/*    border: "1px solid #ddd",*/}
                {/*    borderRadius: "15px",*/}
                {/*    padding: "25px",*/}
                {/*    width: "300px",*/}
                {/*    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",*/}
                {/*    backgroundColor: "#f3e5f5",*/}
                {/*    transition: "transform 0.3s",*/}
                {/*    cursor: "pointer"*/}
                {/*}}*/}
                {/*     onClick={() => handleChangePage("settings")}*/}
                {/*     onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}*/}
                {/*     onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}*/}
                {/*>*/}
                {/*    <h3 style={{color: "#6a1b9a", fontSize: "1.5rem"}}>⚙️ Configurer vos interactions</h3>*/}
                {/*    <p style={{color: "#444"}}>*/}
                {/*        Personnalisez votre expérience avec le site web.*/}
                {/*    </p>*/}
                {/*    <button style={{*/}
                {/*        marginTop: "15px",*/}
                {/*        padding: "10px 18px",*/}
                {/*        backgroundColor: "#9c27b0",*/}
                {/*        color: "#fff",*/}
                {/*        border: "none",*/}
                {/*        borderRadius: "8px",*/}
                {/*        fontWeight: "bold",*/}
                {/*        cursor: "pointer"*/}
                {/*    }}>*/}
                {/*        Paramétrer*/}
                {/*    </button>*/}
                {/*</div>*/}

            </div>

            {/* Bouton logout en bas */}
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

export default Dashboard;
