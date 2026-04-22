'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {Form, Input, Button, Checkbox, Card} from 'antd';
import {signIn} from 'next-auth/react';
import {useTranslations} from '@/contexts/LocaleContext';

export default function LoginClient() {
    const {t} = useTranslations('ecommerce');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const result = await signIn('sanctum', {
                account: values.account,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                console.log(result.error);
            } else {
                const callbackUrl = searchParams.get('callbackUrl') || '/';
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            console.log('login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md shadow-lg border-0" variant="borderless">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">{t('auth.login')}</h1>
                    <p className="text-sm text-gray-500 mt-2">{t('auth.welcomeBack')}</p>
                </div>
                <Form layout="vertical" onFinish={handleSubmit} initialValues={{remember: true}} autoComplete={"off"}>
                    <Form.Item name="account" rules={[{required: true, message: t('auth.accountRequired')}]}>
                        <Input size="large" placeholder={t('auth.account')}/>
                    </Form.Item>
                    <Form.Item name="password" rules={[{required: true, message: t('auth.passwordRequired')}]}>
                        <Input.Password size="large" placeholder={t('auth.password')}/>
                    </Form.Item>
                    <div className="flex items-center justify-between mb-4">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>{t('auth.rememberMe')}</Checkbox>
                        </Form.Item>
                        <a className="text-sm text-gray-700 hover:text-gray-900">{t('auth.forgotPassword')}</a>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large" className="h-11!">
                            {t('auth.login')}
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center text-sm text-gray-500">
                    {t('auth.noAccount')}{' '}
                    <Link href="/register"
                          className="text-gray-700 hover:text-gray-900 font-medium">{t('auth.registerNow')}</Link>
                </div>
            </Card>
        </div>
    );
}
