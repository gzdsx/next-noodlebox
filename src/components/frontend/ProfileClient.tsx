'use client';

import React, {useState} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {useTranslations} from '@/contexts/LocaleContext';
import {toast} from 'sonner';
import {User} from 'lucide-react';
import {apiPost} from "@/lib/api";

interface ProfileClientProps {
    session: any;
}

export default function ProfileClient({session}: ProfileClientProps) {
    const {t} = useTranslations('ecommerce');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(session.user?.name || '');
    const [email, setEmail] = useState(session.user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleProfileSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await apiPost(`/user/profile`, {name, email});
            toast.success(t('user.updateSuccess'));
        } catch {
            toast.error(t('user.updateFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        // Password change logic
        try {
            setLoading(true);
            await apiPost(`/user/update-password`, {
                password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmNewPassword
            });
            toast.success(t('user.changePasswordSuccess'));
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">{t('user.profileSettings')}</h1>
            <Card className="border border-gray-100/30 shadow-sm bg-transparent text-white">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-8">
                        <Avatar className="h-16 w-16">
                            {session.user?.image ? (
                                <AvatarImage src={session.user.image} alt="avatar"/>
                            ) : null}
                            <AvatarFallback>
                                <User size={32}/>
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{session.user?.name || t('user.defaultName')}</h3>
                            <p className="text-sm text-gray-500">{session.user?.email}</p>
                        </div>
                    </div>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('user.nickname')}</Label>
                            <Input
                                id="name"
                                className="h-11"
                                placeholder={t('user.nickname')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                className="h-11"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={!name.length || !email.length || loading} size="lg">
                            {loading ? '...' : t('user.updateProfile')}
                        </Button>
                    </form>
                    <div className="border-t border-gray-100 pt-6 mt-6">
                        <h3 className="text-lg font-semibold mb-4">{t('user.changePassword')}</h3>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">{t('user.currentPassword')}</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    className="h-11"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new_password">{t('user.newPassword')}</Label>
                                <Input
                                    id="new_password"
                                    type="password"
                                    className="h-11"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm_new_password">{t('user.confirmNewPassword')}</Label>
                                <Input
                                    id="confirm_new_password"
                                    type="password"
                                    className="h-11"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" size="lg">{t('user.changePassword')}</Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
