import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import BackButton from "../../../Presentational Component/BackButton";
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import ReactModal from 'react-modal';
// suppose que tu l'importes comme ça

const CommandeDetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const commande = location.state?.commande;
    const [hoverBack, setHoverBack] = useState(false);
    const [lignesPanier, setLignesPanier] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const token = localStorage.getItem("token");
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    const statusLabels = {
        PENDING: "En attente",
        CONFIRMED: "Confirmée",
        SHIPPED: "Expédiée",
        DELIVERED: "Livrée",
        PICKED_UP: "Récupérée",
        PREPARED: "Préparée",
        CANCELED: "Annulée",
    };

    const pickup = commande.pickUpCommandeDTO;
    const delivery = commande.deliveryCommandeDTO;
    const base = commande.commandeResponseDTO;
    const user = commande.userDTO;

    useEffect(() => {
        if (!commande) {
            navigate("/orders");
        }
    }, [commande, navigate]);

    useEffect(() => {
        if (!commande?.commandeResponseDTO?.id) return;

        fetch(`http://localhost:8082/api/v1/cart/commande/${commande.commandeResponseDTO.id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des lignes de panier");
                }
                return response.json();
            })
            .then(data => {
                setLignesPanier(data);
            })
            .catch(error => {
                console.error("Erreur fetch lignesPanier :", error);
            });
    }, [commande, token]);

    const handleStatusChange = (newStatus) => {
        setPendingStatus(newStatus);
        setShowModal(true);
    };

    const confirmStatusChange = () => {
        if (!pendingStatus || !base?.id) return;

        fetch(`http://localhost:8082/api/v1/commande/updateStatus/${base.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pendingStatus), // ✅ stringify le string
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Échec de la mise à jour");
                }
                return response.text();
            })
            .then(data => {
                commande.commandeResponseDTO.orderStatus = pendingStatus;
                setShowModal(false);
                setPendingStatus(null);
                setShowSuccessModal(true); // ✅ Affiche la modal de confirmation
            })
            .catch(error => {
                console.error("Erreur de mise à jour :", error);
                alert("Erreur lors de la mise à jour du statut");
                setShowModal(false);
                setPendingStatus(null);
            });
    };


    const cancelModal = () => {
        setShowModal(false);
        setPendingStatus(null);
    };

    const handleBack = () => {
        setShowSuccessModal(false);
        navigate("/orders");
    }


    if (!commande) return <div>Redirection...</div>;


    return (
        <div style={styles.main}>
            <BackButton to="/orders" label="← Retour"/>
            <LogoutCard/>

            <div style={styles.commandeDetailContainer}>
                <h2 style={styles.commandeTitle}>
                    Détails de la commande de {user?.firstName} {user?.lastName}
                </h2>

                <div style={styles.detailRow}>
                    <span style={styles.label}>Code de confirmation :</span> {base?.confirmationCode}
                </div>

                <div style={styles.detailRow}>
                    <span
                        style={styles.label}>Statut de la commande :</span> {statusLabels[commande.orderStatus] || 'Inconnu'}
                </div>


                <div style={styles.detailRow}>
                    <span
                        style={styles.label}>Téléphone :</span> {pickup?.phone || delivery?.phone || user?.phoneNumber}
                </div>

                <div style={styles.detailRow}>
                    <span
                        style={styles.label}>Lieu de paiement :</span> {pickup?.paymentMethod || delivery?.paymentMethod}
                </div>

                {delivery && (
                    <>
                        <div style={styles.detailRow}>
                            <span style={styles.label}>Type de commande :</span> Livraison
                        </div>
                        <div style={styles.detailRow}>
                            <span
                                style={styles.label}>Adresse :</span> {delivery.adresseDTO?.adresse}, {delivery.adresseDTO?.ville}, {delivery.adresseDTO?.codePostal}
                        </div>
                        <div style={styles.detailRow}>
                            <span style={styles.label}>Note :</span> {delivery.note || '—'}
                        </div>
                    </>
                )}

                {pickup && (
                    <>
                        <div style={styles.detailRow}>
                            <span style={styles.label}>Type de commande :</span> Recupérer en magasin
                        </div>
                        <div style={styles.detailRow}>
                            <span style={styles.label}>Note :</span> {pickup.note || '—'}
                        </div>
                    </>
                )}

                {lignesPanier.length > 0 && (
                    <div style={styles.productsSection}>
                        <h3 style={styles.productsTitle}>Produits commandés</h3>
                        {lignesPanier.map((product, index) => (
                            <div key={index} style={styles.productCard}>
                                <img
                                    src={`data:image/jpeg;base64,${product.product.imageBase64}`}
                                    alt={product.product.name}
                                    style={styles.productImage}
                                />
                                <div style={styles.productInfo}>
                                    <div><strong>Nom :</strong> {product.product.name}</div>
                                    <div><strong>Prix
                                        :</strong> {product.product.price !== undefined ? product.product.price.toFixed(2) : 'N/A'} $
                                    </div>
                                    <div><strong>Quantité :</strong> {product.quantity}</div>
                                    <div><strong>Poids :</strong> {product.product.weight} kg</div>
                                    <div><strong>Marque :</strong> {product.product.brand}</div>
                                </div>
                            </div>
                        ))}

                        <div style={styles.totalContainer}>
                            <h4 style={styles.totalTitle}>Résumé du paiement</h4>

                            {/* Calculs */}
                            {(() => {
                                const subtotal = lignesPanier.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
                                const tps = subtotal * 0.05;
                                const tvq = subtotal * 0.09975;
                                const total = subtotal + tps + tvq;

                                return (
                                    <>
                                        <div style={styles.totalRow}>
                                            <span>Sous-total :</span>
                                            <span>{subtotal.toFixed(2)} $</span>
                                        </div>
                                        <div style={styles.totalRow}>
                                            <span>TPS (5%) :</span>
                                            <span>{tps.toFixed(2)} $</span>
                                        </div>
                                        <div style={styles.totalRow}>
                                            <span>TVQ (9.975%) :</span>
                                            <span>{tvq.toFixed(2)} $</span>
                                        </div>
                                        <div style={{
                                            ...styles.totalRow,
                                            fontWeight: 'bold',
                                            borderTop: '1px solid #ddd',
                                            paddingTop: '10px'
                                        }}>
                                            <span>Total à payer :</span>
                                            <span>{total.toFixed(2)} $</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* === BOUTONS DE STATUT SELON LE TYPE DE COMMANDE === */}
                        <div style={styles.statusButtonContainer}>
                            {pickup && (
                                <button
                                    style={{
                                        ...styles.statusButton,
                                        ...(commande.orderStatus === "PICKED_UP" || commande.orderStatus === "CANCELED" || commande.orderStatus === "PENDING"
                                            ? styles.disabledButton
                                            : {}),
                                    }}
                                    disabled={["PICKED_UP", "CANCELED", "PENDING"].includes(commande.orderStatus)}
                                    onClick={() => handleStatusChange("PICKED_UP")}
                                >
                                    Commande Récupérée
                                </button>

                            )}

                            {delivery && (
                                <button
                                    style={{
                                        ...styles.statusButton,
                                        ...(commande.orderStatus === "DELIVERED" || commande.orderStatus === "CANCELED" || commande.orderStatus === "PENDING"
                                            ? styles.disabledButton
                                            : {}),
                                    }}
                                    disabled={["DELIVERED", "CANCELED", "PENDING"].includes(commande.orderStatus)}
                                    onClick={() => handleStatusChange("DELIVERED")}
                                >
                                    Commande Livrée
                                </button>

                            )}
                        </div>

                    </div>
                )}

            </div>

            <ReactModal
                isOpen={showModal}
                onRequestClose={cancelModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    content: {
                        maxWidth: '400px',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        height: '30%',
                    },
                }}
            >
                <h3>Confirmer le changement</h3>
                <p>Voulez-vous vraiment changer le statut de la commande en <strong>{statusLabels[pendingStatus]}</strong> ?</p>
                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-around'}}>
                    <button style={styles.statusButton} onClick={confirmStatusChange}>Confirmer</button>
                    <button style={styles.cancelButton} onClick={cancelModal}>Annuler</button>
                </div>
            </ReactModal>


            <ReactModal
                isOpen={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    content: {
                        maxWidth: '400px',
                        margin: 'auto',
                        height: '30%',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',

                    },
                }}
            >
                <h3 style={{ color: '#388e3c' }}>✅ Succès</h3>
                <p>Le statut de la commande a été mis à jour avec succès.</p>
                <button
                    style={{ ...styles.statusButton, backgroundColor: '#a5d6a7' }}
                    onClick={handleBack}
                >
                    Fermer
                </button>
            </ReactModal>



        </div>
    );
};

const styles = {
    commandeDetailContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(255, 152, 0, 0.2)',
        fontSize: '1rem',
        color: '#3e2723',
        maxWidth: '800px',
        margin: 'auto',
    },
    commandeTitle: {
        fontSize: '1.6rem',
        marginBottom: '20px',
        color: '#e65100',
        borderBottom: '2px solid #ffcc80',
        paddingBottom: '10px',
    },
    detailRow: {
        marginBottom: '12px',
    },
    label: {
        fontWeight: 'bold',
        color: '#bf360c',
        marginRight: '8px',
    },
    backButton: {
        backgroundColor: '#ffe082',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '20px',
        cursor: 'pointer',
        color: '#5d4037',
        fontWeight: 'bold',
        marginBottom: '20px',
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
    },
    backButtonHover: {
        backgroundColor: '#ffca28',
    },
    commandeType: {
        padding: '8px 12px',
        backgroundColor: '#fff3e0',
        border: '1px solid #ffcc80',
        borderRadius: '12px',
        display: 'inline-block',
        marginTop: '10px',
        color: '#e65100',
        fontWeight: 'bold',
    },
    productsSection: {
        marginTop: '40px',
    },

    productsTitle: {
        fontSize: '1.4rem',
        marginBottom: '20px',
        color: '#e65100',
        borderBottom: '1px solid #ffcc80',
        paddingBottom: '10px',
    },

    productCard: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '20px',
        marginBottom: '25px',
        backgroundColor: '#fff8e1',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(255, 152, 0, 0.2)',
    },

    productImage: {
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        borderRadius: '8px',
        border: '1px solid #ffd54f',
    },

    productInfo: {
        fontSize: '0.95rem',
        color: '#4e342e',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    statusButtonContainer: {
        marginTop: '30px',
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
    },

    statusButton: {
        backgroundColor: '#ffb300',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '12px',
        fontWeight: 'bold',
        color: '#6d4c41',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s',
    },
    cancelButton: {
        backgroundColor: '#ffc107', // Orange clair
        border: 'none',
        padding: '10px 20px',
        borderRadius: '12px',
        fontWeight: 'bold',
        color: '#5d4037',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s',
    },
    totalContainer: {
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#fff3e0',
        borderRadius: '12px',
        boxShadow: '0 1px 6px rgba(255, 152, 0, 0.2)',
    },

    totalTitle: {
        fontSize: '1.2rem',
        marginBottom: '15px',
        color: '#e65100',
    },

    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '1rem',
        color: '#4e342e',
    },
    disabledButton: {
        backgroundColor: '#e0e0e0',
        color: '#9e9e9e',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
};

export default CommandeDetailPage;
