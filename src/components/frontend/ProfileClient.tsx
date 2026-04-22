'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Avatar } from 'antd';
import { User } from 'lucide-react';
import { useTranslations } from '@/contexts/LocaleContext';

interface ProfileClientProps {
    session: any;
}

export default function ProfileClient({ session }: ProfileClientProps) {
    const {t} = useTranslations('ecommerce');
    const [loading, setLoading] = useState(false);

    const handleProfileSubmit = async (values: any) => {
        setLoading(true);
        try {
            message.success(t('user.updateSuccess'));
        } catch {
            message.error(t('user.updateFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('user.profileSettings')}</h1>
            <Card className="border-0 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <Avatar size={64} icon={<User size={32}/>} src={session.user?.image}/>
                    <div>
                        <h3 className="text-lg font-semibold">{session.user?.name || t('user.defaultName')}</h3>
                        <p className="text-sm text-gray-500">{session.user?.email}</p>
                    </div>
                </div>
                <Form layout="vertical" onFinish={handleProfileSubmit}
                      initialValues={{ name: session.user?.name || '', email: session.user?.email || '' }}>
                    <Form.Item name="name" label={t('user.nickname')}>
                        <Input size="large" placeholder={t('user.nickname')}/>
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input size="large" placeholder="Email" disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} size="large">{t('user.updateProfile')}</Button>
                    </Form.Item>
                </Form>
                <div className="border-t border-gray-100 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('user.changePassword')}</h3>
                    <Form layout="vertical">
                        <Form.Item name="current_password" label={t('user.currentPassword')}>
                            <Input.Password size="large"/>
                        </Form.Item>
                        <Form.Item name="new_password" label={t('user.newPassword')}>
                            <Input.Password size="large"/>
                        </Form.Item>
                        <Form.Item name="confirm_new_password" label={t('user.confirmNewPassword')}>
                            <Input.Password size="large"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" size="large">{t('user.changePassword')}</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </div>
    );
}
