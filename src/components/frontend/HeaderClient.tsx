'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {signOut, useSession} from 'next-auth/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    ShoppingCart,
    User,
    Menu,
    LogOut,
    Package,
    Settings,
    ChevronDown,
    Gift,
    Store,
} from 'lucide-react';
import {useCart} from '@/contexts/CartContext';
import {useTranslations, useLocale} from '@/contexts/LocaleContext';
import SearchBar from './SearchBar';
import {useCategories, useCurrentUser} from "@/contexts/AppContext";

export default function HeaderClient() {
    const currentUser = useCurrentUser();
    const session = useSession();
    const foodCategories = useCategories();
    const {totalItems} = useCart();
    const {t} = useTranslations('ecommerce');
    const {locale, setLocale} = useLocale();
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

    const normalStyle = `hover:bg-black/90 hover:text-gray-100`;
    const scrolledStyle = `hover:bg-red-500/90 hover:text-white`;
    const submenuClass = `absolute top-full left-0 bg-black/90 rounded-sm shadow-xl py-2 min-w-60 z-50`;
    const submenuLinkClass = `flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-red-500/90 text-sm`;

    const routeLogin = () => {
        router.push('/auth/login?redirect=' + encodeURIComponent(window.location.origin + window.location.pathname));
    }

    const logout = async () => {
        await signOut({redirectTo: window.location.href});
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Desktop Header */}
            <header
                className={`fixed w-full top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-crimson text-gray-200' : 'text-gray-100'}`}>
                <div className="w-full mx-auto px-4 h-20 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <img src="/logo.png" alt="Noodle Box" style={{height: 60}}/>
                    </Link>

                    {/* Nav Links - Desktop */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {/* OUR SHOP */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setOpenSubmenu('shop')}
                            onMouseLeave={() => setOpenSubmenu(null)}
                        >
                            <button
                                className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${scrolled ? scrolledStyle : normalStyle}`}>
                                <Store size={16}/>
                                OUR SHOP
                                <ChevronDown size={14}
                                             className={`transition-transform ${openSubmenu === 'shop' ? 'rotate-180' : ''}`}/>
                            </button>
                            {openSubmenu === 'shop' && (
                                <div className={submenuClass}>
                                    <Link href="/shop" className={submenuLinkClass}>
                                        <ShoppingCart size={14}/>
                                        DROGHEDA SHOP
                                    </Link>
                                    <Link href="/points-mall" className={submenuLinkClass}>
                                        <Gift size={14}/>
                                        POINTS MALL
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* NOODLEBOX FOOD MENU */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setOpenSubmenu('food')}
                            onMouseLeave={() => setOpenSubmenu(null)}
                        >
                            <button
                                className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-semibold transition-colors ${scrolled ? scrolledStyle : normalStyle}`}>
                                FOOD MENU
                                <ChevronDown size={14}
                                             className={`transition-transform ${openSubmenu === 'food' ? 'rotate-180' : ''}`}/>
                            </button>
                            {openSubmenu === 'food' && (
                                <div className={submenuClass}>
                                    {foodCategories.map(cat => (
                                        <Link key={cat.slug} href={`/category/${cat.slug}`} className={submenuLinkClass}>
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/our-memory"
                              className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${scrolled ? scrolledStyle : normalStyle}`}>
                            OUR MEMORY
                        </Link>
                        <Link href="/food-allergies"
                              className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${scrolled ? scrolledStyle : normalStyle}`}>
                            FOOD ALLERGIES
                        </Link>
                        <Link href="/about-us"
                              className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${scrolled ? scrolledStyle : normalStyle}`}>
                            ABOUT US
                        </Link>
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden sm:block w-48 lg:w-64">
                            <SearchBar/>
                        </div>

                        {/* Cart */}
                        <Link href="/cart"
                              className={`relative p-2 transition-colors ${scrolled ? 'text-white hover:text-gray-200' : 'text-gray-100 hover:text-gray-200'}`}>
                            <ShoppingCart size={22}/>
                            {totalItems > 0 && (
                                <span
                                    className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] font-medium leading-4 text-center text-white bg-red-600 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    tabIndex={-1}
                                    className={`p-2 transition-colors ${scrolled ? 'text-white hover:text-gray-200' : 'text-gray-100 hover:text-gray-200'}`}>
                                    {currentUser?.image ? (
                                        <img
                                            src={currentUser.image}
                                            alt="avatar"
                                            className="rounded-full w-[28px] h-[28px]"
                                        />
                                    ) : (
                                        <User size={22}/>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {session.status === 'authenticated' ? (
                                    <>
                                        <DropdownMenuItem onClick={() => router.push('/user/orders')}>
                                            <Package size={14}/>
                                            {t('header.myOrders')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push('/user/profile')}>
                                            <Settings size={14}/>
                                            {t('header.profile')}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={logout}
                                        >
                                            <LogOut size={14}/>
                                            {t('header.logout')}
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem onClick={routeLogin}>
                                            <User size={14}/>
                                            {t('header.login')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push('/auth/register')}>
                                            <User size={14}/>
                                            {t('header.register')}
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu Button */}
                        <button
                            className={`lg:hidden p-2 transition-colors ${scrolled ? 'text-white' : 'text-gray-100'}`}
                            onClick={() => setDrawerOpen(true)}>
                            <Menu size={22}/>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <Sheet
                open={drawerOpen}
                onOpenChange={(open) => {
                    setDrawerOpen(open);
                    if (!open) setMobileSubmenu(null);
                }}
            >
                <SheetContent side="left" className={'border-r-0!'}>
                    <SheetHeader>
                        <SheetTitle>
                            <div className="flex items-center gap-2">
                                <img src="/logo.png" alt="Noodle Box" style={{height: 35}}/>
                            </div>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-1 px-4">
                        {/* OUR SHOP */}
                        <button
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-100 hover:bg-gray-50 text-sm font-semibold"
                            onClick={() => setMobileSubmenu(mobileSubmenu === 'shop' ? null : 'shop')}
                        >
                            <span className="flex items-center gap-2"><Store size={16}/> OUR SHOP</span>
                            <ChevronDown size={14}
                                         className={`transition-transform ${mobileSubmenu === 'shop' ? 'rotate-180' : ''}`}/>
                        </button>
                        {mobileSubmenu === 'shop' && (
                            <div className="pl-6 flex flex-col gap-1">
                                <Link href="/shop"
                                      className="px-3 py-2 text-gray-100 hover:bg-gray-50 text-sm rounded"
                                      onClick={() => setDrawerOpen(false)}>DROGHEDA SHOP</Link>
                                <Link href="/points-mall"
                                      className="px-3 py-2 text-gray-100 hover:bg-gray-50 text-sm rounded"
                                      onClick={() => setDrawerOpen(false)}>POINTS MALL</Link>
                            </div>
                        )}

                        {/* FOOD MENU */}
                        <button
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-100 hover:bg-gray-50 text-sm font-semibold"
                            onClick={() => setMobileSubmenu(mobileSubmenu === 'food' ? null : 'food')}
                        >
                            FOOD MENU
                            <ChevronDown size={14}
                                         className={`transition-transform ${mobileSubmenu === 'food' ? 'rotate-180' : ''}`}/>
                        </button>
                        {mobileSubmenu === 'food' && (
                            <div className="pl-6 flex flex-col gap-1">
                                {foodCategories.map(cat => (
                                    <Link key={cat.slug}
                                          href={`/category/${cat.slug}`}
                                          className="px-3 py-2 text-gray-100 hover:bg-gray-50 text-sm rounded"
                                          onClick={() => setDrawerOpen(false)}>{cat.name}</Link>
                                ))}
                            </div>
                        )}

                        <Link href="/our-memory"
                              className="px-3 py-2 rounded-lg text-gray-100 hover:bg-gray-50 text-sm font-semibold"
                              onClick={() => setDrawerOpen(false)}>OUR MEMORY</Link>
                        <Link href="/food-allergies"
                              className="px-3 py-2 rounded-lg text-gray-100 hover:bg-gray-50 text-sm font-semibold"
                              onClick={() => setDrawerOpen(false)}>FOOD ALLERGIES</Link>
                        <Link href="/about-us"
                              className="px-3 py-2 rounded-lg text-gray-100 hover:bg-gray-50 text-sm font-semibold"
                              onClick={() => setDrawerOpen(false)}>ABOUT US</Link>

                        <div className="border-t mt-4 pt-4">
                            <button
                                className="px-3 py-2 rounded-lg text-gray-100 hover:bg-gray-50 text-sm w-full text-left"
                                onClick={() => {
                                    setLocale(locale === 'zh' ? 'en' : 'zh');
                                }}>
                                {locale === 'zh' ? 'English' : '中文'}
                            </button>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    );
}
