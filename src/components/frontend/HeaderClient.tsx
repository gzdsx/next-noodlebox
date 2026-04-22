'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useSession, signOut} from 'next-auth/react';
import {Badge, Dropdown, Drawer} from 'antd';
import {
    ShoppingCart,
    User,
    Menu,
    LogOut,
    Package,
    Settings,
} from 'lucide-react';
import {useCart} from '@/contexts/CartContext';
import {useTranslations, useLocale} from '@/contexts/LocaleContext';
import SearchBar from './SearchBar';

export default function HeaderClient() {
    const {data: session} = useSession();
    const {totalItems} = useCart();
    const {t} = useTranslations('ecommerce');
    const {locale, setLocale} = useLocale();
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navLinks = [
        {href: '/', label: t('header.home')},
        {href: '/products', label: t('header.products')},
    ];

    const userMenuItems = session ? [
        {
            key: 'orders',
            icon: <Package size={14}/>,
            label: t('header.myOrders'),
            onClick: () => router.push('/user/orders'),
        },
        {
            key: 'profile',
            icon: <Settings size={14}/>,
            label: t('header.profile'),
            onClick: () => router.push('/user/profile'),
        },
        {type: 'divider' as const},
        {
            key: 'logout',
            icon: <LogOut size={14}/>,
            label: t('header.logout'),
            onClick: () => signOut({redirectTo: window.location.pathname}),
        },
    ] : [
        {
            key: 'login',
            icon: <User size={14}/>,
            label: t('header.login'),
            onClick: () => router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname)),
        },
        {
            key: 'register',
            icon: <User size={14}/>,
            label: t('header.register'),
            onClick: () => router.push('/register'),
        },
    ];

    return (
        <>
            {/* Desktop Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <img src="/logo.png" alt="Logo" style={{height:50}}/>
                    </Link>

                    {/* Nav Links - Desktop */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href}
                                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden sm:block w-64">
                            <SearchBar/>
                        </div>

                        {/* Language Switch */}
                        <button
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
                        >
                            {locale === 'zh' ? 'EN' : '中文'}
                        </button>

                        {/* Cart */}
                        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <Badge count={totalItems} size="small" color="#1677ff">
                                <ShoppingCart size={22}/>
                            </Badge>
                        </Link>

                        {/* User Menu */}
                        <Dropdown menu={{items: userMenuItems}} trigger={['click']}>
                            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                {session?.user?.image ? (
                                    <Image src={session.user.image} alt="avatar" width={28} height={28}
                                           className="rounded-full"/>
                                ) : (
                                    <User size={22}/>
                                )}
                            </button>
                        </Dropdown>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-gray-600" onClick={() => setDrawerOpen(true)}>
                            <Menu size={22}/>
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="sm:hidden px-4 pb-3">
                    <SearchBar/>
                </div>
            </header>

            {/* Mobile Drawer */}
            <Drawer
                title={t('brandName')}
                placement="left"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                size="default"
            >
                <nav className="flex flex-col gap-1">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href}
                              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                              onClick={() => setDrawerOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    <button
                        className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                        onClick={() => { setLocale(locale === 'zh' ? 'en' : 'zh'); }}
                    >
                        {locale === 'zh' ? 'English' : '中文'}
                    </button>
                </nav>
            </Drawer>
        </>
    );
}
