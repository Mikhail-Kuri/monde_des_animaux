import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './DashBoard';
import DashboardAdmin from './DashboardAdmin';

const ProtectedDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://localhost:8082/api/v1/user/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }
                return response.json();
            })
            .then(data => {
                setUserData(data);
            })
            .catch(() => {
                localStorage.removeItem("token");
                navigate("/login");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!userData) {
        return null;
    }

    return userData.role === "ADMIN" ? <DashboardAdmin user={userData} /> : <Dashboard user={userData} />;
};

export default ProtectedDashboard;
