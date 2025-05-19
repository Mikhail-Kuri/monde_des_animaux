import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const LogoutCard = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = () => {
        setLoggingOut(true);
        setTimeout(() => {
            localStorage.removeItem("token");
            window.location.reload();
        }, 2000);
    };

    return (
        <>
            <div className="logout-card" onClick={() => setShowLogoutModal(true)}>
                <span className="logout-icon">🔒</span> Déconnexion
            </div>

            {/* Modal de déconnexion */}
            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
                <Modal.Body className="text-center">
                    {loggingOut ? (
                        <>
                            <FaCheckCircle size={80} color="green" />
                            <p>Merci et Bonne journée 😊</p>
                        </>
                    ) : (
                        "Voulez-vous vraiment vous déconnecter ?"
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {!loggingOut && (
                        <>
                            <button className="custom-btn" onClick={() => setShowLogoutModal(false)}>Annuler</button>
                            <button className="custom-btn" onClick={handleLogout}>Confirmer</button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

const styles = document.createElement("style");
styles.innerHTML = `
    .logout-card {
        position: fixed;
        top: 10px;
        right: -100px;
        background-color: red;
        color: white;
        padding: 15px;
        border-radius: 10px 0 0 10px;
        cursor: pointer;
        transition: right 0.3s ease-in-out;
        width: 140px;
        text-align: center;
        font-weight: bold;
        z-index: 1111;
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
    }

    .logout-card:hover {
        right: 0 !important;
    }

    @media (max-width: 768px) {
        .logout-card {
            width: 120px;
            padding: 10px;
            font-size: 14px;
        }
    }

    @media (max-width: 480px) {
        .logout-card {
            width: 100px;
            padding: 8px;
            font-size: 12px;
        }
    }
`;
document.head.appendChild(styles);

export default LogoutCard;
