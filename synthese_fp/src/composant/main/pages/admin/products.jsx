import { useState, useEffect } from "react";
import LogoutCard from "../../../Presentational Component/LogoutCard.js";
import {useNavigate} from "react-router-dom";
import "./CSS/style.css"
import BackButton from "../../../Presentational Component/BackButton";

function ProductsAdmin() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalImage, setModalImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("TOUS");
    const [sortOrder, setSortOrder] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:8082/api/v1/product/all", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    throw new Error("Non autorisé. Veuillez vous reconnecter.");
                }
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des produits.");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedCategory !== "TOUS") {
            filtered = filtered.filter((product) => product.category.toUpperCase() === selectedCategory);
        }

        if (sortOrder) {
            filtered.sort((a, b) => {
                if (sortOrder === "price-asc") return a.price - b.price;
                if (sortOrder === "price-desc") return b.price - a.price;
                if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
                if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
                return 0;
            });
        }

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, sortOrder, products]);

    return (
        <div style={styles.container}>
            <BackButton to="/dashboard" label="← Retour"/>

            <div style={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    style={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button style={styles.addButton} onClick={() => navigate("/createProduct")}>➕ Ajouter un produit</button>
            </div>

            <div style={styles.content}>
                <div style={styles.sidebar}>
                    <h3>Catégories</h3>
                    {["TOUS", "CHIEN", "CHAT", "OISEAU", "POISSON", "RONGEUR"].map((category, index) => (
                        <button
                            key={`${category}-${index}`}
                            style={{
                                ...styles.categoryButton,
                                backgroundColor: selectedCategory === category ? "orange" : "#fff"
                            }}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category.charAt(0) + category.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div style={styles.productSection}>
                    <div style={styles.productHeader}>
                        <h2>Produits disponibles</h2>
                        <select style={styles.sortSelect} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="">Trier par</option>
                            <option value="price-asc">Prix : Bas → Haut</option>
                            <option value="price-desc">Prix : Haut → Bas</option>
                            <option value="name-asc">Nom : A → Z</option>
                            <option value="name-desc">Nom : Z → A</option>
                        </select>
                    </div>

                    {loading ? (
                        <p>Chargement des produits...</p>
                    ) : error ? (
                        <p style={{color: "red"}}>{error}</p>
                    ) : (
                        <div style={styles.grid}>
                            {filteredProducts.map((product, index) => (
                                <div key={product.id || `product-${index}`} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                                    <img
                                        src={product.imageBase64 ? `data:image/jpeg;base64,${product.imageBase64}` : "https://via.placeholder.com/150"}
                                        alt={product.name}
                                        style={styles.image}
                                        onClick={() => setModalImage(`data:image/jpeg;base64,${product.imageBase64}`)}
                                    />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p style={styles.price}>{product.price} $</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <LogoutCard/>

            {modalImage && (
                <div style={styles.modal} onClick={() => setModalImage(null)}>
                    <div style={styles.modalContent}>
                        <img src={modalImage} alt="Produit" style={styles.modalImage}/>
                    </div>
                </div>
            )}
        </div>
    );
}


const styles = {
    container: {
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box"
    },
    searchBar: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        position: "sticky",
        top: 0,
        zIndex: 1000
    },
    searchInput: {
        padding: "10px",
        fontSize: "1rem",
        width: "300px",
        borderRadius: "5px",
        border: "1px solid #ccc"
    },
    addButton: {
        padding: "10px 15px",
        fontSize: "1rem",
        backgroundColor: "orange",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    content: {
        display: "flex",
        flexGrow: 1,
        gap: "20px"
    },
    sidebar: {
        width: "20%",
        backgroundColor: "#f9f9f9",
        padding: "15px",
        borderRadius: "10px",
        textAlign: "center",
        height: "calc(100vh - 80px)",
        position: "sticky",
        top: "80px",
        overflowY: "auto"
    },
    categoryButton: {
        display: "block",
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        backgroundColor: "#fff",
        color: "#333"
    },
    productSection: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
    },
    productHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "10px",
        backgroundColor: "#f9f9f9",
        padding: "10px",
        borderRadius: "10px"
    },
    sortSelect: {
        padding: "8px",
        fontSize: "1rem",
        borderRadius: "5px",
        border: "1px solid #ccc"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
        padding: "10px"
    },
    card: {
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center"
    },
    price: {
        fontWeight: "bold",
        color: "green"
    },
    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer"
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "30%",
        height: "50%",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "100%",
        maxHeight: "80%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    modalImage: {
        maxWidth: "100%",
        maxHeight: "100%",
        borderRadius: "10px"
    },
    image: {
        width: "100%",
        height: "150px",
        objectFit: "cover",
        borderRadius: "10px",
        cursor: "zoom-in"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    logoutButton: {
        padding: "10px 15px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default ProductsAdmin;
