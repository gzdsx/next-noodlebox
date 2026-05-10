'use client';

import React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useTranslations} from '@/contexts/LocaleContext';
import {Package, User, Coins} from 'lucide-react';

const menuItems = [
    {href: '/user/orders', icon: Package, labelKey: 'orders'},
    {href: '/user/points', icon: Coins, labelKey: 'points'},
    {href: '/user/profile', icon: User, labelKey: 'profile'},
];

export default function UserLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const {t} = useTranslations('ecommerce');

    return (
        <div className="w-full md:max-w-350 mx-auto px-4 py-6">
            <div className={'h-24'}></div>
            <div className="flex flex-col md:flex-row gap-6">
                <aside className="md:w-52 shrink-0 border border-gray-100/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold mb-3">{t('user.userCenter')}</h3>
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                            isActive
                                                ? 'bg-[#66beb8] text-white font-medium'
                                                : 'text-gray-300 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon size={16}/>
                                        {t(`user.${item.labelKey}`)}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </aside>
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
