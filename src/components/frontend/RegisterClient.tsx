'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { signIn } from 'next-auth/react';
import { apiPost } from '@/lib/api';
import { useTranslations } from '@/contexts/LocaleContext';
import { toast } from 'sonner';

export default function RegisterClient() {
    const {t} = useTranslations('ecommerce');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [agree, setAgree] = useState(false);

    const updateField = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error(t('auth.passwordMismatch'));
            return;
        }
        if (!agree) {
            toast.error(t('auth.agreeTermsRequired'));
            return;
        }

        setLoading(true);
        try {
            await apiPost('/auth/register', {
                name: form.username,
                email: form.email,
                password: form.password,
            });
            toast.success(t('auth.registerSuccess'));
            await signIn('sanctum', {
                redirect: false,
                account: form.email,
                password: form.password,
            });
            router.push('/');
            router.refresh();
        } catch (error: any) {
            toast.error(error?.message || t('auth.registerFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardContent className="pt-6">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">{t('auth.register')}</h1>
                        <p className="text-sm text-gray-500 mt-2">{t('auth.registerSubtitle')}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">{t('user.nickname')}</Label>
                            <Input
                                id="username"
                                className="h-11"
                                placeholder={t('user.nickname')}
                                value={form.username}
                                onChange={(e) => updateField('username', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                className="h-11"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => updateField('email', e.target.value)}
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
                                value={form.password}
                                onChange={(e) => updateField('password', e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                className="h-11"
                                placeholder={t('auth.confirmPassword')}
                                value={form.confirmPassword}
                                onChange={(e) => updateField('confirmPassword', e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="agree"
                                checked={agree}
                                onCheckedChange={(checked) => setAgree(checked === true)}
                            />
                            <label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer">
                                {t('auth.agreeTerms')}
                            </label>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full h-11">
                            {loading ? '...' : t('auth.register')}
                        </Button>
                    </form>
                    <div className="text-center text-sm text-gray-500 mt-4">
                        {t('auth.hasAccount')}{' '}
                        <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">{t('auth.loginNow')}</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
