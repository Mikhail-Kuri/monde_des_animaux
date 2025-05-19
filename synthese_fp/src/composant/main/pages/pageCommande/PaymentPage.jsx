import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";
import PaymentForm from "./PaymentForm";

const PaymentPage = () => {
    const location = useLocation();
    const { total, userCart, paymentInfo } = location.state || { total: "0.00", userCart: [], paymentInfo: null };


    return <PaymentForm total={total} userCart={userCart} paymentInfo={paymentInfo}  />;
};

export default PaymentPage;
