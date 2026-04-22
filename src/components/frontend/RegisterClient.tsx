'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { signIn } from 'next-auth/react';
import { apiPost } from '@/lib/api';
import { useTranslations } from '@/contexts/LocaleContext';

export default function RegisterClient() {
    const {t} = useTranslations('ecommerce');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        if (values.password !== values.confirmPassword) {
            message.error(t('auth.passwordMismatch'));
            return;
        }
        setLoading(true);
        try {
            await apiPost('/auth/register', {
                name: values.username,
                email: values.email,
                password: values.password,
            });
            message.success(t('auth.registerSuccess'));
            await signIn('sanctum', {
                redirect: false,
                account: values.email,
                password: values.password,
            });
            router.push('/');
            router.refresh();
        } catch (error: any) {
            message.error(error?.message || t('auth.registerFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md shadow-lg border-0" variant="borderless">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">{t('auth.register')}</h1>
                    <p className="text-sm text-gray-500 mt-2">{t('auth.registerSubtitle')}</p>
                </div>
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: t("auth.usernameRequired") }]}
                    >
                        <Input size="large" placeholder={t("user.nickname")}/>
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: t("auth.emailRequired") },
                            { type: "email", message: t("auth.emailInvalid") },
                        ]}
                    >
                        <Input size="large" placeholder="Email"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: t("auth.passwordRequired") },
                            { min: 6, message: t("auth.passwordMinLength") },
                        ]}
                    >
                        <Input.Password size="large" placeholder={t("auth.password")}/>
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: t("auth.confirmPasswordRequired") },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) return Promise.resolve();
                                    return Promise.reject(new Error(t("auth.passwordMismatch")));
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" placeholder={t("auth.confirmPassword")}/>
                    </Form.Item>
                    <Form.Item
                        name="agree"
                        valuePropName="checked"
                        rules={[{
                            validator: (_, val) =>
                                val ? Promise.resolve() : Promise.reject(new Error(t("auth.agreeTermsRequired"))),
                        }]}
                    >
                        <Checkbox>{t("auth.agreeTerms")}</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large" className="!h-11">
                            {t("auth.register")}
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center text-sm text-gray-500">
                    {t("auth.hasAccount")}{" "}
                    <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">{t("auth.loginNow")}</Link>
                </div>
            </Card>
        </div>
    );
}
