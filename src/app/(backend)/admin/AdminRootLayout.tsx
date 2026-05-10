'use client'

import {BackendAppProvider} from "@/contexts/BackendAppContext";
import AdminLoginClient from "@/components/backend/AdminLoginClient";
import AdminLayoutClient from "@/app/(backend)/admin/AdminLayoutClient";
import {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
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
        return <div className="flex justify-center items-center h-screen w-screen"><Spinner size="lg"/></div>;
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