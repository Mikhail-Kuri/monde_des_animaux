import React, {useEffect, useState} from 'react';
import {FaInbox, FaPaperPlane, FaStore, FaTruck} from 'react-icons/fa';
import {useLocation} from "react-router-dom";
import BackButton from "../../../Presentational Component/BackButton";
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import {useNavigate} from "react-router-dom";

const OrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [commandes, setCommandes] = useState([]);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState("id"); // valeur par défaut
    const [statusFilter, setStatusFilter] = useState(null); // null = aucun filtre
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });
    const [typeFilter, setTypeFilter] = useState("all");

    const statusLabels = {
        PENDING: "En attente",
        CONFIRMED: "Confirmée",
        DELIVERED: "Livrée",
        PICKED_UP: "Récupérée",
        // CANCELED: "Annulée",
    };


    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "#ff9800"; // orange
            case "CONFIRMED":
                return "#2196f3"; // bleu
            case "PICKED_UP":
                return "#009688"; // teal (ajustable selon ta préférence)
            case "DELIVERED":
                return "#4caf50"; // vert
            // case "CANCELED":
            //     return "#f44336"; // rouge
            default:
                return "#000"; // noir par défaut
        }
    };


    const filteredCommandes = commandes.filter((commande) => {
        const pickup = commande.pickUpCommandeDTO;
        const delivery = commande.deliveryCommandeDTO;
        const base = commande.commandeResponseDTO || {};
        const user = commande.userDTO || {};
        const lowerSearch = searchText.toLowerCase();

        const matchesDate = selectedDate
            ? commande.dateCommande === selectedDate
            : true;


        const matchesText = (() => {
            switch (filterType) {
                case "id":
                    return String(base.id || "").includes(searchText);
                case "confirmationCode":
                    return (base.confirmationCode || "").toLowerCase().includes(lowerSearch);
                case "phone":
                    return (
                        (pickup?.phone || "").includes(searchText) ||
                        (delivery?.phone || "").includes(searchText) ||
                        (user.phoneNumber || "").includes(searchText)
                    );
                case "paymentMethod":
                    return (
                        (pickup?.paymentMethod || "").toLowerCase().includes(lowerSearch) ||
                        (delivery?.paymentMethod || "").toLowerCase().includes(lowerSearch)
                    );
                case "name":
                    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
                    return fullName.includes(lowerSearch);
                default:
                    return true;
            }
        })();

        const matchesStatus = statusFilter ? commande.orderStatus === statusFilter : true;

        const matchesType = (() => {
            if (typeFilter === "all") return true;
            if (typeFilter === "delivery") return delivery !== null && delivery !== undefined;
            if (typeFilter === "pickup") return pickup !== null && pickup !== undefined;
            return true;
        })();

        return matchesText && matchesStatus && matchesDate && matchesType;

    });


    useEffect(() => {
        fetch("http://localhost:8082/api/v1/admin/all/orders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // ⚠️ Ajuste si nécessaire
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors de la récupération des commandes");
                return res.json();
            })
            .then((data) => {
                setCommandes(data);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.topHeader}>
                <BackButton to="/dashboard" label="← Retour"/>
                <LogoutCard/>
                <div style={styles.legendContainer}>
                    {["PENDING", "CONFIRMED", "DELIVERED", "PICKED_UP"]
                        .filter((status) => {
                            if (typeFilter === "delivery") return !["PREPARED", "PICKED_UP"].includes(status);
                            if (typeFilter === "pickup") return !["SHIPPED", "DELIVERED"].includes(status);
                            return true; // pour "all"
                        })
                        .map((status) => (
                            <div
                                key={status}
                                style={{
                                    ...styles.legendItem,
                                    ...(statusFilter === status ? styles.activeLegend : {
                                        backgroundColor: "#fffde7",
                                        borderColor: "#ffc107",
                                        fontWeight: "normal",
                                        scale: "1",
                                    }),
                                }}
                                onClick={() => setStatusFilter(prev => prev === status ? null : status)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                <span style={{...styles.statusCircle, backgroundColor: getStatusColor(status)}}></span>
                                <span>{statusLabels[status]}</span>
                            </div>
                        ))}
                </div>


            </div>

            <aside style={styles.sidebar}>
                <div style={styles.logo}>Commades</div>
                <nav style={styles.nav}>
                    <div
                        style={{
                            ...styles.navItem,
                            ...(typeFilter === "all" ? styles.activeNavItem : {})
                        }}
                        onClick={() => setTypeFilter("all")}
                    >
                        <FaInbox/> <span>Toutes les commandes</span>
                    </div>
                    <div
                        style={{
                            ...styles.navItem,
                            ...(typeFilter === "delivery" ? styles.activeNavItem : {})
                        }}
                        onClick={() => setTypeFilter("delivery")}
                    >
                        <FaTruck/> <span>Livraison</span>
                    </div>
                    <div
                        style={{
                            ...styles.navItem,
                            ...(typeFilter === "pickup" ? styles.activeNavItem : {})
                        }}
                        onClick={() => setTypeFilter("pickup")}
                    >
                        <FaStore/> <span>Retrait en magasin</span>
                    </div>
                </nav>

            </aside>

            <main style={styles.main}>
                <div style={styles.topBar}>
                    <div style={styles.filterContainer}>


                        <select
                            style={styles.select}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="id">ID</option>
                            <option value="phone">Téléphone</option>
                            <option value="paymentMethod">Lieu de paiement</option>
                            <option value="confirmationCode">Code de confirmation</option>
                            <option value="name">Nom du client</option>
                            {/* ← Ajout ici */}
                        </select>


                        <input
                            style={styles.searchInput}
                            type="text"
                            placeholder="Rechercher une commande..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />

                        <input
                            type="date"
                            style={styles.datePicker}
                            value={selectedDate}
                            placeholder={"Date de la commande"}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = "#ffb300"}
                            onBlur={(e) => e.target.style.borderColor = "#ffc107"}
                        />

                    </div>
                </div>


                <div style={styles.emailList}>
                    {error && <div style={{color: 'red', padding: '10px'}}>{error}</div>}

                    {filteredCommandes.length > 0 ? (
                        filteredCommandes.map((commande, index) => {
                            const pickup = commande.pickUpCommandeDTO;
                            const delivery = commande.deliveryCommandeDTO;
                            const hasPickup = pickup !== null && pickup !== undefined;
                            const hasDelivery = delivery !== null && delivery !== undefined;

                            return (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.emailItem
                                    }}
                                    onClick={() => navigate(`/commande/${commande.commandeResponseDTO?.id}`, {state: {commande}})}
                                >
                                    <div style={styles.emailFrom}>
                                        Commande de {commande.userDTO?.firstName} {commande.userDTO?.lastName}
                                    </div>


                                    <div style={styles.emailContent}>
                                        <div><strong>Code
                                            :</strong> {commande.commandeResponseDTO?.confirmationCode || '—'}</div>
                                        {hasPickup && (
                                            <div>
                                                <strong>Statut :</strong> {statusLabels[commande.orderStatus]}<br/>
                                                <strong>Type :</strong> Retrait en magasin<br/>
                                                <strong>Lieu de paiement :</strong> {pickup.paymentMethod}<br/>
                                                {/*<strong>Date :</strong> {pickup.date} à {pickup.time}<br/>*/}
                                                <strong>Téléphone
                                                    :</strong> {pickup.phone || commande.userDTO?.phoneNumber || '—'}<br/>
                                                <strong>Note :</strong> {pickup.note || '—'}<br/>
                                                {/*<strong>Panier :</strong> #{pickup.panierId}<br/>*/}

                                            </div>
                                        )}
                                        {hasDelivery && (
                                            <div>
                                                <strong>Statut :</strong> {statusLabels[commande.orderStatus]}<br/>
                                                <strong>Type :</strong> Livraison<br/>
                                                <strong>Lieu de paiement :</strong> {delivery.paymentMethod}<br/>

                                                {/*<strong>Date :</strong> {delivery.date} à {delivery.time}<br/>*/}
                                                <strong>Téléphone
                                                    :</strong> {delivery.phone || commande.userDTO?.phoneNumber || '—'}<br/>
                                                <strong>Livraison au
                                                    :</strong> {delivery.adresseDTO?.adresse}, {delivery.adresseDTO?.ville}, {delivery.adresseDTO?.codePostal}<br/>
                                                <strong>Note :</strong> {delivery.note || '—'}<br/>
                                                {/*<strong>Panier :</strong> #{delivery.panierId}<br/>*/}

                                            </div>
                                        )}
                                    </div>

                                    <div style={styles.emailDate}>
                                        <div><strong>#</strong> {commande.commandeResponseDTO?.id}</div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{padding: '10px'}}>Aucune commande trouvée.</div>
                    )}

                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        backgroundColor: '#fff7f0',
        paddingTop: '60px',
    },
    sidebar: {
        width: '240px',
        backgroundColor: '#fff3e0',
        borderRight: '1px solid #ffd6a0',
        padding: '20px',
        boxSizing: 'border-box'
    },
    logo: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: '#ff6f00',
        marginBottom: '20px'
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        color: '#e65100',
        fontSize: '1rem',
        padding: '8px',
        borderRadius: '6px',
        transition: 'background 0.2s',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxSizing: 'border-box'
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    searchInput: {
        width: '50%',
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ffc107',
        outline: 'none',
        backgroundColor: '#fffde7',
    },
    emailList: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'auto',
        boxShadow: '0 2px 10px rgba(255, 152, 0, 0.2)',
    },
    emailItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 20px',
        borderBottom: '1px solid #ffe0b2',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    emailFrom: {
        width: '20%',
        fontWeight: 'bold',
        color: 'black',
    },
    emailContent: {
        width: '60%',
        color: 'black',
    },
    emailDate: {
        width: '20%',
        textAlign: 'right',
        color: 'black',
    },
    topHeader: {
        width: '100%',
        height: '10%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#fff3e0',
        borderBottom: '1px solid #ffd6a0',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10,
        boxSizing: 'border-box',
    },
    select: {
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ffc107',
        backgroundColor: '#fffde7',
        marginRight: '10px',
        outline: 'none',
    },
    legendContainer: {
        display: 'flex',
        gap: '15px',
        margin: 'auto',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.95rem',
        backgroundColor: '#fffde7',
        padding: '4px 10px',
        borderRadius: '20px',
        border: '1px solid #ffc107',
        cursor: 'pointer', // ← Curseur cliquable
        transition: 'all 0.3s ease', // <- pour une animation fluide
    },
    statusCircle: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        display: 'inline-block',
    },
    activeLegend: {
        backgroundColor: '#ffe082',
        fontWeight: 'bold',
        borderColor: '#ffb300',
        scale: '1.05',
    },
    datePicker: {
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ffc107',
        backgroundColor: '#fffde7',
        outline: 'none',
        marginLeft: '10px',
        width: '160px',          // largeur fixe plus lisible qu'en % ici
        fontSize: '1rem',       // taille de texte harmonieuse
        boxShadow: '0 0 5px rgba(255, 193, 7, 0.5)', // légère ombre jaune autour

    },
    filterContainer: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        backgroundColor: '#fff8e1',
        border: '1px solid #ffe082',
        borderRadius: '16px',
        boxShadow: '0 2px 6px rgba(255, 193, 7, 0.2)',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },


};

export default OrderPage;
