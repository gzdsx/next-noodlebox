import {ConfigProvider, App} from "antd";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {Metadata} from "next";
import {SessionProvider} from "next-auth/react";
import {LocaleProvider} from "@/contexts/LocaleContext";
import {CartProvider} from "@/contexts/CartContext";
import {auth} from "@/auth";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import './globals.css';

export const metadata: Metadata = {
    title: "大师兄的小店 - 精选好物，品质生活",
    keywords: "电商,购物,精选好物",
    description: "大师兄的小店 — 精选好物，品质生活",
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
};

export const dynamic = 'force-dynamic';

export default async function FrontendLayout({
                                                 children,
                                             }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <html lang="zh" className="w-full overflow-x-hidden">
        <body className="bg-white text-gray-900 min-h-screen w-full overflow-x-hidden">
        <LocaleProvider>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#1677ff',
                        colorBgContainer: '#ffffff',
                        colorText: '#1a1a1a',
                        borderRadius: 8,
                    },
                }}
            >
                <AntdRegistry>
                    <SessionProvider session={session}>
                        <CartProvider>
                            <App>
                                <Header/>
                                <main className="min-h-screen">{children}</main>
                                <Footer/>
                            </App>
                        </CartProvider>
                    </SessionProvider>
                </AntdRegistry>
            </ConfigProvider>
        </LocaleProvider>
        </body>
        </html>
    );
}
