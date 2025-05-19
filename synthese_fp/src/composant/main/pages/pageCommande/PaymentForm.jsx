import React, {useEffect, useState} from "react";
import {useStripe, useElements, CardElement} from "@stripe/react-stripe-js"; // Import des hooks Stripe Elements
import {loadStripe} from "@stripe/stripe-js"; // Import de la fonction loadStripe
import "./CSS/payment-form.css";
import {useNavigate} from "react-router-dom";
import BackButton from "../../../Presentational Component/BackButton";
import LogoutCard from "../../../Presentational Component/LogoutCard.js";

// Charge la clé publique de Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({total, userCart, paymentInfo}) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const today = new Date().toISOString().split("T")[0];
    const [dateOption, setDateOption] = useState("TODAY");
    const [pickupDate, setPickupDate] = useState(today);
    const [pickupTime, setPickupTime] = useState("");
    const [cardComplete, setCardComplete] = useState(false);
    const [cardError, setCardError] = useState(null);
    const TPS_RATE = 0.05;
    const TVQ_RATE = 0.09975;

    const subtotal = userCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tpsAmount = subtotal * TPS_RATE;
    const tvqAmount = subtotal * TVQ_RATE;
    const total2 = subtotal + tpsAmount + tvqAmount;



    // transpromer le total en cent
    const totalInCents = Math.round(total * 100);

    // Création de la requête de paiement
    const PaymentRequest = {
        panierId: paymentInfo?.panierId || null,
        lignePaniers: userCart,
        total: totalInCents,
        date: pickupDate || null,
        heure: pickupTime || null,
    }

    useEffect(() => {
        if (dateOption === "TODAY") {
            setPickupDate(today);
            setPickupTime("");
        }
    }, [dateOption, today]);


    // Fonction de gestion du paiement
    const handleStripePayment = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe n'est pas encore chargé
            return;
        }

        setIsProcessing(true);

        // Créer un paiement sur ton serveur
        const response = await fetch("http://localhost:8082/api/v1/payment/create-payment-intent", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(PaymentRequest),
        });

        const session = await response.json();

        // Créer le paiement sur Stripe à l'aide de la session
        const {error, paymentIntent} = await stripe.confirmCardPayment(session.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement), // Utilise l'élément de carte pour le paiement
            }
        });

        if (error) {
            console.error("Erreur de paiement:", error);
            alert("Erreur de paiement : " + error.message);
        } else {
            // Le paiement a réussi
            // Naviguer vers la page de confirmation ou autre
            navigate("/payment_confirmation");
        }

        setIsProcessing(false);
    };

    return (
        <div className="payment-container">
            <LogoutCard/>
            <div className="payment-header">
                <BackButton to="/paiement-en-attente" label="← Retour"/>
            </div>

            <div className="payment-body">
                <div className="payment-left">
                    <h2>Paiement</h2>
                    <div className="card-icons">
                        <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa"/>
                        <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="MasterCard"/>
                        <img src="https://img.icons8.com/color/48/000000/maestro.png" alt="Maestro"/>
                    </div>

                    <form onSubmit={handleStripePayment}>
                        <label>Nom du titulaire</label>
                        <input placeholder="Mike Le Cool" required/>

                        <label>Numéro de carte</label>
                        <CardElement
                            options={{hidePostalCode: true}}
                            onChange={(event) => {
                                setCardComplete(event.complete);
                                setCardError(event.error ? event.error.message : null);
                            }}
                        />


                        {/* Choix de la date */}
                        <div className="date-selection">
                            <label>
                                📅 Quand souhaitez-vous recevoir ou venir chercher votre commande ?
                                <br/>
                                <small style={{color: "#555"}}>
                                    Choisissez "Aujourd’hui" si vous la voulez dans les prochaines heures,
                                    ou "Date personnalisée" si vous préférez fixer un jour et une heure précis.
                                </small>
                            </label>
                            <select value={dateOption} onChange={e => setDateOption(e.target.value)}>
                                <option value="TODAY">Aujourd’hui</option>
                                <option value="CUSTOM">Date personnalisée</option>
                            </select>
                        </div>


                        {dateOption === "CUSTOM" && (
                            <>
                                <div className="form-group">
                                    <label>📅 Jour du pick-up :</label>
                                    <input
                                        type="date"
                                        value={pickupDate}
                                        onChange={e => setPickupDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>⏰ Heure estimée :</label>
                                    <input
                                        type="time"
                                        value={pickupTime}
                                        onChange={e => setPickupTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}


                        <button
                            className="btn-pay"
                            type="submit"
                            disabled={!stripe || isProcessing || !cardComplete || cardError}
                        >
                            {isProcessing ? "Traitement..." : "Effectuer le paiement"}
                        </button>

                    </form>
                </div>

                <div className="payment-right">
                    <h2>Résumé</h2>
                    {userCart && userCart.length > 0 && (
                        <div className="cart-summary">
                            <h3>🧾 Détail de la commande</h3>
                            <ul className="cart-items">
                                {userCart.map((item, index) => (
                                    <li key={index} className="cart-item">
                                        <div className="item-left">
                                            <span className="item-name">{item.productName}</span>
                                            <span className="item-quantity">× {item.quantity}</span>
                                        </div>
                                        <div className="item-price">
                                            {(item.price * item.quantity).toFixed(2)} $
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="total-with-taxes">
                        <div>TPS (5%) : <strong>{tpsAmount.toFixed(2)} $</strong></div>
                        <div>TVQ (9.975%) : <strong>{tvqAmount.toFixed(2)} $</strong></div>
                        <div>Total avec taxes : <strong>{total2.toFixed(2)} $</strong></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
