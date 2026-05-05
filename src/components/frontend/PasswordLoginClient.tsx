'use client'

import React, {useState} from "react";
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {useTranslations} from "@/contexts/LocaleContext";
import {signIn} from "next-auth/react";
import {useSearchParams} from "next/navigation";

const PasswordLoginClient = () => {
    const {t} = useTranslations('ecommerce');
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await signIn('sanctum', {
            account,
            password,
            redirect: false,
        });
        setLoading(false);
        if (result?.error){
            setError('Your account or password is incorrect');
            return;
        }

        if (result?.ok) {
            const redirect = searchParams.get('redirect') || '/';
            if (redirect) window.location.href = redirect;
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="account">{t('auth.account')}</Label>
                <Input
                    id="account"
                    size={0}
                    className="h-11"
                    placeholder={t('auth.account')}
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                    id="password"
                    type="password"
                    className="h-11"
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full h-11 mt-4">
                {loading ? '...' : t('auth.login')}
            </Button>
        </form>
    );
}

export default PasswordLoginClient;