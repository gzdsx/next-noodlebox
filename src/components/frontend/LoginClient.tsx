'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {signIn} from 'next-auth/react';
import {useTranslations} from '@/contexts/LocaleContext';

export default function LoginClient() {
    const {t} = useTranslations('ecommerce');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account || !password) return;

        setLoading(true);
        try {
            const result = await signIn('sanctum', {
                account,
                password,
                redirect: false,
            });

            if (result?.ok) {
                const redirect = searchParams.get('redirect') || '/';
                if (redirect) window.location.href = redirect;
            }else{
                alert(result?.error)
            }
        } catch (error) {
            console.log('login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardContent className="pt-6">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">{t('auth.login')}</h1>
                        <p className="text-sm text-gray-500 mt-2">{t('auth.welcomeBack')}</p>
                    </div>
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    checked={remember}
                                    onCheckedChange={(checked) => setRemember(checked === true)}
                                />
                                <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                                    {t('auth.rememberMe')}
                                </label>
                            </div>
                            <a className="text-sm text-gray-700 hover:text-gray-900">{t('auth.forgotPassword')}</a>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full h-11">
                            {loading ? '...' : t('auth.login')}
                        </Button>
                    </form>
                    <div className="text-center text-sm text-gray-500 mt-4">
                        {t('auth.noAccount')}{' '}
                        <Link href="/register"
                              className="text-gray-700 hover:text-gray-900 font-medium">{t('auth.registerNow')}</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
