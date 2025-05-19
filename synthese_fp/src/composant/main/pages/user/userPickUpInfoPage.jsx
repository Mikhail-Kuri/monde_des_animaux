import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import BackButton from "../../../Presentational Component/BackButton";

const UserPickUpInfoPage = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);


    const [dateOption, setDateOption] = useState("TODAY");
    const [form, setForm] = useState({
        date: today,
        time: "",
        paymentMethod: "MAGASIN",
        phone: "",
        note: "",
        panierId: null
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:8082/api/v1/cart", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors de la récupération du panier.");
                return response.json();
            })
            .then(data => {
                setForm(prev => ({...prev, panierId: data.id}));
            })
            .catch(err => {
                console.error(err.message);

            });
    }, []);

    useEffect(() => {
        if (dateOption === "TODAY") {
            setForm(prev => ({...prev, date: today, time: ""}));
        }
    }, [dateOption, today]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        const isPaymentOnline = form.paymentMethod === "EN_LIGNE";

        const payload = {
            confirmationCode: null,
            paymentMethod: form.paymentMethod,
            phone: form.phone || null,
            note: form.note || null,
            date: isPaymentOnline ? null : form.date || null,
            time: isPaymentOnline ? null : form.time || null,
            panierId: form.panierId || null
        };

        fetch("http://localhost:8082/api/v1/commande/pick_up", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors de l'enregistrement de la commande.");
                return response.json();
            })
            .then(data => {
                setSuccess(true);
                setTimeout(() => {
                    if (isPaymentOnline) {
                        navigate("/paiement-en-attente", {
                            state: {panierId: form.panierId}
                        });
                    } else {
                        navigate("/confirmation", {
                            state: {
                                formData: {
                                    ...form,
                                    confirmationCode: data.confirmationCode
                                }
                            }
                        });
                    }
                }, 1500); // délai avant la redirection
            })
            .catch(error => {
                console.error("❌ Erreur :", error.message);
                alert("Une erreur est survenue. Veuillez réessayer.");
                setShowModal(false);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };


    // const handleBack = () => {
    //     navigate("/userCart"); // 🔙 Retour à la page précédente
    // };

    const isPaymentOnline = form.paymentMethod === "EN_LIGNE";
    const isCustomDate = dateOption === "CUSTOM";

    return (
        <div style={styles.container}>
            <LogoutCard/>
            <BackButton to="/userCart" label="← Retour"/>
            <h2 style={styles.title}>🎉 Procédure de retrait en magasin</h2>
            <p style={styles.paragraph}>
                Une fois votre commande confirmée ou payée, vous recevrez un <strong>code de confirmation</strong>.
                Présentez ce code en boutique lors du retrait. Merci d’indiquer quand vous viendrez récupérer vos
                articles.
                <br/><br/>
                <em>📸 On vous conseille de prendre le code en photo pour ne pas l’oublier et nous le montrer au comptoir
                    !</em>
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>

                <div style={styles.formGroup}>
                    <label style={styles.label_1}>💳 Mode de paiement :</label>
                    <select
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={handleChange}
                        style={styles.input}
                    >
                        <option value="MAGASIN">Payer en magasin</option>
                        <option value="EN_LIGNE">Payer en ligne</option>
                    </select>
                </div>

                {!isPaymentOnline && (
                    <div style={styles.formGroup}>
                        <label style={styles.label_1}>📅 Choisissez une option :</label>
                        <select
                            name="dateOption"
                            value={dateOption}
                            onChange={e => setDateOption(e.target.value)}
                            style={styles.input}
                        >
                            <option value="TODAY">Aujourd’hui</option>
                            <option value="CUSTOM">Date personnalisée</option>
                        </select>
                    </div>
                )}

                {!isPaymentOnline && isCustomDate && (
                    <>
                        <div style={styles.formGroup}>
                            <label style={styles.label_1}>📅 Jour du pick-up :</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label_1}>⏰ Heure estimée :</label>
                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                    </>
                )}

                {isPaymentOnline && (
                    <div style={{
                        fontStyle: "italic",
                        backgroundColor: "#fff3cd",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ffeeba"
                    }}>
                        🕒 Vous pourrez venir chercher votre commande dès que le paiement sera effectué, pendant nos
                        heures d’ouverture.
                    </div>
                )}

                <div style={styles.formGroup}>
                    <label style={styles.label_1}>📞 Téléphone (optionnel) :</label>
                    <input type="tel" name="phone" onChange={handleChange} style={styles.input}/>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label_1}>📝 Note ou demande spéciale :</label>
                    <textarea name="note" rows="3" onChange={handleChange} style={styles.textarea}/>
                </div>

                <button type="button" style={styles.submitBtn} onClick={() => setShowModal(true)}>
                    Commander !
                </button>

            </form>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        {!success ? (
                            <>
                                <h3>Confirmer votre commande ?</h3>
                                <p>Souhaitez-vous vraiment commander avec les informations fournies ?</p>
                                <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
                                    <button onClick={handleSubmit} style={styles.confirmBtn}>Oui, commander</button>
                                    <button onClick={() => {
                                        setShowModal(false);
                                    }} style={styles.cancelBtn}>Annuler
                                    </button>

                                </div>
                            </>
                        ) : (
                            <>
                                <h3 style={{color: "green", fontSize: "2rem"}}>✔</h3>
                                <p>Commande réussie ! Redirection en cours...</p>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    title: {
        fontSize: "2rem",
        marginBottom: "20px",
        textAlign: "center"
    },
    paragraph: {
        fontSize: "1rem",
        marginBottom: "30px",
        lineHeight: "1.6",
        textAlign: "justify"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    formGroup: {
        display: "flex",
        flexDirection: "column"
    },
    label_1: {
        fontWeight: "600",
        marginBottom: "6px",
        position: "static"
    },
    input: {
        padding: "10px",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },
    textarea: {
        padding: "10px",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
        resize: "vertical"
    },
    submitBtn: {
        marginTop: "10px",
        backgroundColor: "#ff8800",
        color: "white",
        padding: "14px",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background-color 0.3s ease"
    },
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
    modalOverlay: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: "#fffaf0",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
    },
    cancelBtn: {
        padding: "10px 20px",
        backgroundColor: "#ffcc80",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        color: "#444"
    },
    confirmBtn: {
        padding: "10px 20px",
        backgroundColor: "#fb8c00", // orange vif
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

export default UserPickUpInfoPage;
