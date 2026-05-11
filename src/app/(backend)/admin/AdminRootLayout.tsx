'use client'

import {BackendAppProvider} from "@/contexts/BackendAppContext";
import AdminLoginClient from "@/components/backend/AdminLoginClient";
import AdminLayoutClient from "@/app/(backend)/admin/AdminLayoutClient";
import OrderNotification from "@/components/backend/OrderNotification";
import Cookies from "js-cookie";
import {useLayoutEffect, useState} from "react";
import {Spin} from "antd";


const AdminRootLayout = ({children}: { children: React.ReactNode }) => {
    const [loaidng, setLoaidng] = useState(true);
    const [token, setToken] = useState<string|undefined>('');

    useLayoutEffect(() => {
        (function () {
            const accessToken = Cookies.get('adminToken');
            setToken(accessToken);
            setLoaidng(false);
        })()
    }, []);

    if (loaidng) {
        return (
            <Spin size={'large'} fullscreen={true} styles={{
                indicator: {'color': '#55b5a5'}
            }} style={{backgroundColor: '#fff'}}/>
        )
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