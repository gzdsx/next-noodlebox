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

export default async function FrontendLayout({
                                                 children,
                                             }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <html lang="en" className="w-full overflow-x-hidden">
        <body className="bg-[#444] text-gray-100 min-h-screen w-full overflow-x-hidden pb-14 lg:pb-0">
        <LocaleProvider>
            <SessionProvider session={session}>
                <AppProvider>
                    <CartProvider>
                        <Header/>
                        <main className="min-h-screen">{children}</main>
                        <Footer/>
                        <MobileTabbar/>
                        <Toaster richColors position="top-center"/>
                    </CartProvider>
                </AppProvider>
            </SessionProvider>
        </LocaleProvider>
        </body>
        </html>
    );
}
