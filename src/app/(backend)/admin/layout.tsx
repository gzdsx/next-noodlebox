import AdminLayoutClient from './AdminLayoutClient';
import {BackendAppProvider} from "@/contexts/BackendAppProvider";

export default function AdminRootLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <BackendAppProvider>
            <AdminLayoutClient>{children}</AdminLayoutClient>
        </BackendAppProvider>
    );
}
