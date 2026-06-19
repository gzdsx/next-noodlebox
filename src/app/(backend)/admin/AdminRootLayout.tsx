'use client'

import {Spin} from "antd";
import {useLayoutEffect, useState} from "react";
import {BackendAppProvider} from "@/contexts/BackendAppContext";
import AdminLayoutClient from "@/app/(backend)/admin/AdminLayoutClient";
import OrderNotification from "@/components/backend/OrderNotification";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'


const queryClient = new QueryClient();
const AdminRootLayout = ({children}: { children: React.ReactNode }) => {
    const [loaidng, setLoaidng] = useState(true);

    useLayoutEffect(() => {
        (function () {
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

    return (
        <QueryClientProvider client={queryClient}>
            <BackendAppProvider>
                <AdminLayoutClient>{children}</AdminLayoutClient>
                <OrderNotification/>
            </BackendAppProvider>
        </QueryClientProvider>
    );
};

export default AdminRootLayout;