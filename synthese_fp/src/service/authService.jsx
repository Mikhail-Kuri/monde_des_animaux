const API_URL = "http://localhost:8082/api/v1";

export const registerUser = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            // Gérer spécifiquement l'erreur 409 (Conflit)
            if (response.status === 409) {
                throw new Error("Un compte avec cet email ou ce numéro de téléphone existe déjà.");
            }
            throw new Error(data.message || "Échec de l'inscription.");
        }

        return data;
    } catch (error) {
        throw new Error(error.message || "Erreur de connexion au serveur.");
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/authenticate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Invalid credentials");
        return data;
    } catch (error) {
        throw new Error("Error connecting to server");
    }
};

export const fetchUserProfile = async (token) => {
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error("Error retrieving user info");
    } catch (error) {
        throw new Error("Error retrieving user info");
    }
};
