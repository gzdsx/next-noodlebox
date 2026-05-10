'use client'

import {Spin} from "antd";
import {useEffect, useState} from "react";
import {BackendAppProvider} from "@/contexts/BackendAppContext";
import AdminLoginClient from "@/components/backend/AdminLoginClient";
import AdminLayoutClient from "@/app/(backend)/admin/AdminLayoutClient";
import OrderNotification from "@/components/backend/OrderNotification";


const AdminRootLayout = ({children}: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        (function () {
            const accessToken = localStorage.getItem('adminToken');
            if (accessToken) setToken(accessToken);
            setLoading(false);
        })()
    }, []);

    if (loading) {
        return <Spin fullscreen={true}/>;
    }

    if (!token) {
        return <AdminLoginClient/>;
    }
    return (
        <BackendAppProvider>
            <AdminLayoutClient>{children}</AdminLayoutClient>
            <OrderNotification/>
        </BackendAppProvider>
    );
};

export default AdminRootLayout;