import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./CSS/style.css";
import { FaSave } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";

const categories = ["CHIEN", "CHAT", "RONGEUR", "OISEAU", "POISSON"];
const brands = [
    "ROYAL_CANIN", "HILLS", "PROPLAN", "BLUE_BUFFALO", "PURINA", "ORIJEN", "ACANA", "PEDIGREE", "EUKANUBA", "NUTRO",
    "WHISKAS", "FELIX", "SHEBA", "FRISKIES", "NATURAL_BALANCE", "IAMS", "Intersand",
    "OXBOW", "VITAKRAFT", "SUPREME_PET_FOODS", "JR_FARM", "BEAPHAR",
    "KAYTEE", "HAGEN", "ZUPREEM", "VERSELE_LAGA", "HARI",
    "TETRA", "JBL", "API", "SEACHEM", "SERA", "FLUVAL"
];

function CreateProduct() {
    const navigate = useNavigate();
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        imageBase64: "",
        brand: "",
        weight: ""
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct(prevState => ({ ...prevState, imageBase64: reader.result.split(",")[1] }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!newProduct.name || !newProduct.description || !newProduct.category || !newProduct.price || !newProduct.quantity || !newProduct.brand || !newProduct.weight) {
            setError("Tous les champs sont obligatoires.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8082/api/v1/product/create", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la création du produit.");
            }

            await response.json();
            setShowSuccessModal(true);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="product-container">
            <div className="container mt-4 content">
                <button className="custom-btn mb-3" onClick={() => navigate("/products")}>← Retour</button>
                <div className="row">
                    <div className="col-md-6">
                        <h3>Créer un nouveau produit</h3>
                        <ul className="list-group">
                            <li className="list-group-item"><strong>Nom:</strong> <input type="text" name="name" value={newProduct.name} onChange={handleChange} required /></li>
                            <li className="list-group-item"><strong>Description:</strong> <textarea name="description" value={newProduct.description} onChange={handleChange} required /></li>
                            <li className="list-group-item"><strong>Catégorie:</strong>
                                <select name="category" value={newProduct.category} onChange={handleChange} required>
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </li>
                            <li className="list-group-item"><strong>Prix:</strong> <input type="number" name="price" value={newProduct.price} onChange={handleChange} required /></li>
                            <li className="list-group-item"><strong>Quantité:</strong> <input type="number" name="quantity" value={newProduct.quantity} onChange={handleChange} required /></li>
                            <li className="list-group-item"><strong>Marque:</strong>
                                <select name="brand" value={newProduct.brand} onChange={handleChange} required>
                                    <option value="">Sélectionner une marque</option>
                                    {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                                </select>
                            </li>
                            <li className="list-group-item"><strong>Poids:</strong> <input type="number" name="weight" value={newProduct.weight} onChange={handleChange} required /></li>
                            <li className="list-group-item text-center">
                                <input type="file" accept="image/*" onChange={handleImageChange} className="mb-3" required />
                            </li>
                        </ul>
                        <div className="mt-3">
                            <button className="custom-btn" onClick={handleSave}><FaSave /> Enregistrer</button>
                        </div>
                        {error && <p className="text-danger mt-2">{error}</p>}
                        <LogoutCard />
                    </div>
                    <div className="col-md-6 text-center">
                        <img
                            src={newProduct.imageBase64 ? `data:image/jpeg;base64,${newProduct.imageBase64}` : "https://via.placeholder.com/300"}
                            alt={newProduct.name}
                            className="img-fluid rounded"
                            style={{ objectFit: "cover", width: "100%", height: "auto" }}
                        />
                    </div>
                </div>
            </div>
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Produit créé avec succès</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Le produit a été ajouté avec succès !</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="custom-btn" onClick={() => navigate("/products")}>OK</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CreateProduct;
