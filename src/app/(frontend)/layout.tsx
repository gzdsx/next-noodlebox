import {LocaleProvider} from "@/contexts/LocaleContext";
import {CartProvider} from "@/contexts/CartContext";
import {auth} from "@/auth";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import MobileTabbar from "@/components/frontend/MobileTabbar";
import {Toaster} from "sonner";
import {AppProvider} from "@/contexts/AppContext";
import './globals.css';
import {apiGet} from "@/lib/api";
import {Category} from "@/types";
import {LotteryProvider} from "@/contexts/LotteryContext";
import {Metadata} from "next";
import {SessionProvider} from "next-auth/react";
import CookieClient from "@/components/frontend/CookieClient";

const getConfig = async () => {
    try {
        const response = await apiGet('/webconfig');
        return response.data;
    } catch (e) {
        console.log('获取配置失败:', e);
        return {};
    }
}

export async function generateMetadata():Promise<Metadata> {
    try {
        const config = await getConfig();
        return {
            title: config.sitename,
            keywords: config.keywords,
            description: config.description,
        } as Metadata;
    } catch {
        return {};
    }
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
};

export const dynamic = 'force-dynamic';

const getCategories = async () => {
    try {
        const response = await apiGet('/categories', {taxonomy: 'product'});
        return response.data.items.filter((cat: Category) => cat.id !== 221 && cat.id !== 15);
    } catch (e) {
        console.log('获取分类失败:', e);
        return [];
    }
}

export default async function FrontendLayout({
                                                 children,
                                             }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const categories = await getCategories();
    const webconfig = await getConfig();

    return (
        <html lang="en" className="w-full overflow-x-hidden">
        <body className="bg-[#444] text-gray-100 min-h-screen w-full overflow-x-hidden pb-14 lg:pb-0">
        <LocaleProvider>
            <SessionProvider session={session}>
                <AppProvider categories={categories} webconfig={{
                    title: webconfig.sitename,
                    keywords: webconfig.keywords,
                    description: webconfig.description,
                    home_page_banner_src: webconfig.home_page_banner_src,
                }}>
                    <CartProvider>
                        <LotteryProvider>
                            <Header/>
                            <main className="min-h-125">{children}</main>
                            <Footer/>
                            <MobileTabbar/>
                            <CookieClient/>
                            <Toaster richColors position="top-center"/>
                        </LotteryProvider>
                    </CartProvider>
                </AppProvider>
            </SessionProvider>
        </LocaleProvider>
        </body>
        </html>
    );
}
