import LoginClient from '@/components/frontend/LoginClient';
import {Card, CardContent} from "@/components/ui/card";

export default function LoginPage() {
    return (
        <div className="w-full flex items-center justify-center px-4 pt-20 md:pt-40 pb-12">
            <Card className="w-full max-w-120 border border-gray-200/20 bg-transparent">
                <CardContent className="pt-6 text-white">
                    <LoginClient/>
                </CardContent>
            </Card>
        </div>
    );
}
