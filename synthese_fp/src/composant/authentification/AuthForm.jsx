import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, fetchUserProfile } from '../../service/authService';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { FaSpinner } from 'react-icons/fa';  // Import du spinner
import '../authentification/CSS/AuthForm.scss';

const AuthForm = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('signup');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phoneNumber: '',
        address: '', password: '', confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const isSignupFormValid = () => {
        const phoneNumberDigits = formData.phoneNumber.replace(/\D/g, '');
        return Object.values(formData).every(value => value.trim() !== "") && phoneNumberDigits.length === 10;
    };

    const isLoginFormValid = () => {
        return formData.email.trim() !== "" && formData.password.trim() !== "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phoneNumber") {
            let cleaned = value.replace(/\D/g, '');

            if (cleaned.length > 10) {
                cleaned = cleaned.slice(0, 10);
            }

            let formattedNumber = cleaned;
            if (cleaned.length > 6) {
                formattedNumber = `(${cleaned.slice(0, 3)})-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
            } else if (cleaned.length > 3) {
                formattedNumber = `(${cleaned.slice(0, 3)})-${cleaned.slice(3)}`;
            } else if (cleaned.length > 0) {
                formattedNumber = `(${cleaned}`;
            }

            setFormData({ ...formData, [name]: formattedNumber });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage('❌ Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const data = await registerUser(formData);
            localStorage.setItem("token", data.token);
            await fetchUserProfile(data.token);
            navigate('/dashboard');
        } catch (error) {
            if (error.message.includes("Un compte avec cet email ou ce numéro de téléphone existe déjà.")) {
                setMessage('⚠️ Un compte avec cet email ou ce numéro de téléphone existe déjà.');
            } else {
                setMessage('⚠️ Erreur lors de la création du compte. Veuillez réessayer plus tard.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const data = await loginUser(formData.email, formData.password);
            localStorage.setItem("token", data.token);
            await fetchUserProfile(data.token);
            navigate('/dashboard');
        } catch (error) {
            setMessage('❌ Email ou mot de passe incorrect.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form">
            <ul className="tab-group">
                <li className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>
                    <a href="#signup">Créer un compte</a>
                </li>
                <li className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
                    <a href="#login">Connexion</a>
                </li>
            </ul>
            <div className="tab-content">
                {activeTab === 'signup' && (
                    <div id="signup">
                        <h1>Créer un compte gratuit</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="top-row">
                                <FloatingLabelInput label="Prénom" type="text" name="firstName" required
                                                    value={formData.firstName} onChange={handleChange}/>
                                <FloatingLabelInput label="Nom" type="text" name="lastName" required
                                                    value={formData.lastName} onChange={handleChange}/>
                            </div>
                            <FloatingLabelInput label="Adresse e-mail" type="email" name="email" required
                                                value={formData.email} onChange={handleChange}/>
                            <FloatingLabelInput label="Numéro de téléphone" type="tel" name="phoneNumber" required
                                                value={formData.phoneNumber} onChange={handleChange}/>
                            <FloatingLabelInput label="Adresse postale" type="text" name="address" required
                                                value={formData.address} onChange={handleChange}/>
                            <FloatingLabelInput label="Mot de passe" type="password" name="password" required
                                                value={formData.password} onChange={handleChange}/>
                            <FloatingLabelInput label="Confirmer le mot de passe" type="password" name="confirmPassword" required
                                                value={formData.confirmPassword} onChange={handleChange}/>

                            <button type="submit" className="button button-block"
                                    disabled={!isSignupFormValid() || loading}>
                                {loading ? <FaSpinner className="spinner"/> : "Créer le compte"}
                            </button>
                        </form>
                        {message && <p className="error-message">{message}</p>}
                    </div>
                )}

                {activeTab === 'login' && (
                    <div id="login">
                        <h1>Bienvenue !</h1>
                        <form onSubmit={handleLoginSubmit}>
                            <FloatingLabelInput label="Adresse e-mail" type="email" name="email" required
                                                value={formData.email} onChange={handleChange}/>
                            <FloatingLabelInput label="Mot de passe" type="password" name="password" required
                                                value={formData.password} onChange={handleChange}/>

                            <button type="submit" className="button button-block"
                                    disabled={!isLoginFormValid() || loading}>
                                {loading ? <FaSpinner className="spinner"/> : "Se connecter"}
                            </button>
                            {message && <p className="error-message">{message}</p>}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
