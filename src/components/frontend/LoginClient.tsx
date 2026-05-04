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
            } else {
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
                    <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300"/>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11 bg-white border-gray-300 hover:bg-gray-50"
                            onClick={() => signIn('google')}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Sign in with Google
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
