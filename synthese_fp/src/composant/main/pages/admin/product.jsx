import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./CSS/style.css";
import { FaEdit, FaTrash, FaCheckCircle, FaSave } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import BackButton from "../../../Presentational Component/BackButton";

const generateCircles = (numCircles) => {
    return Array.from({ length: numCircles }, (_, index) => ({
        id: index,
        size: Math.random() * 80 + 30,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2
    }));
};

function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [circles] = useState(generateCircles(10));
    const [showModal, setShowModal] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8082/api/v1/product/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement du produit.");
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setEditedProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8082/api/v1/product/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la suppression du produit.");
                }
                setDeleted(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate("/products");
                }, 2000);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleSave = () => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8082/api/v1/product/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedProduct)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la mise à jour du produit.");
                }
                return response.json();
            })
            .then(data => {
                setProduct(data);
                setIsEditing(false);
                setShowSuccessModal(true);
            })
            .catch(error => {
                setError(error.message);
            });
    };

    if (loading) return <p>Chargement du produit...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!product) return <p>Produit introuvable.</p>;

    return (
        <div className="product-container">
            <BackButton to="/dashboard" label="← Retour" />
            {circles.map(circle => (
                <div
                    key={circle.id}
                    className="circle"
                    style={{
                        width: `${circle.size}px`,
                        height: `${circle.size}px`,
                        top: `${circle.top}%`,
                        left: `${circle.left}%`,
                        opacity: circle.opacity
                    }}
                />
            ))}

            <div className="container mt-4 content">
                <button className="custom-btn mb-3" onClick={() => navigate("/products")}>← Retour</button>
                <div className="row">
                    <div className="col-md-6 text-center">
                        <img
                            src={product.imageBase64 ? `data:image/jpeg;base64,${product.imageBase64}` : "https://via.placeholder.com/300"}
                            alt={product.name}
                            className="img-fluid rounded"
                        />
                        <h2 className="mt-3">
                            {isEditing ? <input type="text" name="name" value={editedProduct.name} onChange={handleChange} /> : product.name}
                        </h2>
                        <p>
                            {isEditing ? <textarea name="description" value={editedProduct.description} onChange={handleChange} /> : product.description}
                        </p>
                    </div>
                    <div className="col-md-6">
                        <h3>Détails du produit</h3>
                        <ul className="list-group">
                            <li className="list-group-item"><strong>Catégorie:</strong> {isEditing ? <input type="text" name="category" value={editedProduct.category} onChange={handleChange} /> : product.category}</li>
                            <li className="list-group-item"><strong>Prix:</strong> {isEditing ? <input type="number" name="price" value={editedProduct.price} onChange={handleChange} /> : product.price} $</li>
                            <li className="list-group-item"><strong>Quantité:</strong> {isEditing ? <input type="number" name="quantity" value={editedProduct.quantity} onChange={handleChange} /> : product.quantity}</li>
                        </ul>
                        <div className="mt-3 d-flex justify-content-between">
                            {isEditing ? <button className="custom-btn" onClick={handleSave}><FaSave /> Enregistrer</button> : <button className="custom-btn" onClick={handleEdit}><FaEdit /> Modifier</button>}
                            <button className="custom-btn" onClick={() => setShowModal(true)}><FaTrash /> Supprimer</button>
                        </div>
                        <LogoutCard />
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!deleted ? "Êtes-vous sûr de vouloir supprimer ce produit ?" : (
                        <div className="text-center">
                            <FaCheckCircle size={80} color="green" />
                            <p>Produit supprimé avec succès !</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {!deleted && (
                        <>
                            <button className="custom-btn" onClick={() => setShowModal(false)}>Annuler</button>
                            <button className="custom-btn" onClick={handleDelete}>Confirmer</button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modification réussie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <FaCheckCircle size={80} color="green" />
                        <p>Le produit a été mis à jour avec succès !</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="custom-btn" onClick={() => setShowSuccessModal(false)}>OK</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Product;