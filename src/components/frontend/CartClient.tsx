'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from '@/contexts/LocaleContext';
import CartItemRow from '@/components/frontend/CartItemRow';
import CartSummary from '@/components/frontend/CartSummary';

export default function CartClient() {
    const { items, clearCart } = useCart();
    const {t} = useTranslations('ecommerce');

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <EmptyState
                    icon={ShoppingBag}
                    description={t('cart.empty')}
                >
                    <Link href="/shop">
                        <Button size="lg">{t('cart.startShopping')}</Button>
                    </Link>
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="max-w-360 mx-auto px-4 py-6">
            <div className={'h-24'}></div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{t('cart.title')}</h1>
                <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={clearCart}>{t('cart.deleteSelected')}</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-100 p-4">
                        <div className="hidden sm:flex items-center gap-4 pb-3 border-b border-gray-200 text-xs uppercase tracking-wide">
                            <span className="w-20">{t('product.productItem')}</span>
                            <span className="flex-1"/>
                            <span className="w-16 text-center">{t('product.price')}</span>
                            <span className="w-34 text-center">{t('cart.quantity')}</span>
                            <span className="w-20 text-right">{t('cart.subtotal')}</span>
                            <span className="w-8"/>
                        </div>
                        {items.map((item) => (
                            <CartItemRow key={`cart-item-${item.id}`} item={item}/>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky top-20">
                        <CartSummary/>
                    </div>
                </div>
            </div>
        </div>
    );
}
