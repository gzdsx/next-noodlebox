import {ConfigProvider, App} from "antd";
import {Metadata} from "next";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {LocaleProvider} from "@/contexts/LocaleContext";
import AdminRootLayout from "./admin/AdminRootLayout";
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
                    <App>
                        <AdminRootLayout>{children}</AdminRootLayout>
                    </App>
                </AntdRegistry>
            </ConfigProvider>
        </LocaleProvider>
        </body>
        </html>
    );
}
