import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import PrivateRoute from "./service/PrivateRouter";
import AuthForm from "./composant/authentification/AuthForm";
import ProtectedDashboard from "./composant/main/DashBoards/ProtectedDashboard";
import ProductsAdmin from "./composant/main/pages/admin/products";
import Product from "./composant/main/pages/admin/product";
import CreateProduct from "./composant/main/pages/admin/CreateProduct";
import UserProducts from "./composant/main/pages/user/userPorducts";
import UserCartPage from "./composant/main/pages/user/userCartPage";
import UserPickUpInfoPage from "./composant/main/pages/user/userPickUpInfoPage";
import ConfirmationPage from "./composant/main/pages/pageCommande/ConfirmationPage";
import PaiementEnAttentePage from "./composant/main/pages/pageCommande/PaiementEnAttentePage";
import UserDeliveryInfoPage from "./composant/main/pages/user/userDeliveryInfoPage";
import PaymentForm from "./composant/main/pages/pageCommande/PaymentForm";
import PaymentPage from "./composant/main/pages/pageCommande/PaymentPage";
import SettingsPage from "./composant/main/pages/settings/SettingsPage";
import PaymentConfirmation from "./composant/main/pages/pageCommande/PaymentConfirmation";
import OrderPage from "./composant/main/pages/admin/OrderPage";
import CommandeDetailPage from "./composant/main/pages/admin/CommandeDetailPage";
import ToilettagePage from "./composant/main/pages/pageToilletage/ToilettagePage";

// Charger la clé publique Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirige vers /login par défaut */}
                <Route path="/" element={<Navigate replace to="/login"/>}/>

                {/* Route de connexion */}
                <Route path="/login" element={<AuthForm/>}/>

                {/* Routes protégées */}
                <Route element={<PrivateRoute/>}>
                    <Route path="/dashboard" element={<ProtectedDashboard/>}/>
                    <Route path="/products" element={<ProductsAdmin/>}/>
                    <Route path="/product/:id" element={<Product/>}/>
                    <Route path="/createProduct" element={<CreateProduct/>}/>
                    <Route path="/orders" element={<OrderPage/>}/>
                    <Route path="/commande/:id" element={<CommandeDetailPage />} />


                    <Route path="/userProducts" element={<UserProducts/>}/>
                    <Route path="/userCart" element={<UserCartPage/>}/>
                    <Route path="/pickup-info" element={<UserPickUpInfoPage/>}/>
                    <Route path="/livraison_info" element={<UserDeliveryInfoPage/>}/>

                    <Route path="/confirmation" element={<ConfirmationPage/>}/>
                    <Route path="/paiement-en-attente" element={<PaiementEnAttentePage/>}/>
                    <Route path="/payment-page" element={
                        <Elements stripe={stripePromise}>
                            <PaymentPage/>
                        </Elements>
                    }/>
                    <Route path="/payment_confirmation" element={<PaymentConfirmation />} />

                    <Route path="/toilettage" element={<ToilettagePage/>}/>

                </Route>

                {/* Route de paiement avec Stripe */}

            </Routes>
        </Router>
    );
}

export default App;
