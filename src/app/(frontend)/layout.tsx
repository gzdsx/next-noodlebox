import {Metadata} from "next";
import {SessionProvider} from "next-auth/react";
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

export const metadata: Metadata = {
    title: "Noodle Box - The Best Chinese Takeaway In Drogheda",
    keywords: "Noodle Box, Chinese takeaway, Drogheda, Asian food, online order",
    description: "Order the best Asian food online from Noodle Box - Chinese takeaway in Drogheda, Ireland. Enjoy the best prices, Fast delivery, High quality ingredients.",
};

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

    return (
        <html lang="en" className="w-full overflow-x-hidden">
        <body className="bg-[#444] text-gray-100 min-h-screen w-full overflow-x-hidden pb-14 lg:pb-0">
        <LocaleProvider>
            <SessionProvider session={session}>
                <AppProvider categories={categories}>
                    <CartProvider>
                        <LotteryProvider>
                            <Header/>
                            <main className="min-h-125">{children}</main>
                            <Footer/>
                            <MobileTabbar/>
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
