import {ConfigProvider, App} from "antd";
import {Metadata} from "next";
import {SessionProvider} from "next-auth/react";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {LocaleProvider} from "@/contexts/LocaleContext";
import {auth} from "@/auth";
import './globals.css';

export const metadata: Metadata = {
    title: "后台管理中心",
    keywords: "大师兄微小店",
    description: "大师兄微小店",
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
}

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <html lang="en" className="w-full overflow-x-hidden relative">
        <body className={`min-h-screen w-full overflow-x-hidden relative overscroll-x-none`}>
        <LocaleProvider>
            <ConfigProvider theme={{
                components: {
                    Button: {
                        iconGap: 4
                    }
                }
            }}>
                <AntdRegistry>
                    <SessionProvider session={session}>
                        <App>
                            {children}
                        </App>
                    </SessionProvider>
                </AntdRegistry>
            </ConfigProvider>
        </LocaleProvider>
        </body>
        </html>
    );
}
