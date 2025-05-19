import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/payment-confirmation.css";
import { CheckCircle } from "lucide-react";

const PaymentConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="confirmation-container">
            <div className="confirmation-card">
                <CheckCircle className="confirmation-icon" />
                <h1>Paiement réussi !</h1>
                <p>Merci pour votre commande. Nous avons bien reçu votre paiement.</p>

                <div className="order-details">
                    <h2>📦 Prochaine étape :</h2>
                    <ul>
                        <li>Votre commande est en préparation.</li>
                        <li>Vous recevrez un appel ou un message texte dès que votre commande sera prête ou expédiée.</li>
                    </ul>
                </div>

                <div className="confirmation-actions">
                    <button className="btn-home" onClick={() => navigate("/userProducts")}>Retour à l'accueil</button>
                    {/*<button className="btn-orders" onClick={() => navigate("/mes-commandes")}>Voir mes commandes</button>*/}
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmation;
