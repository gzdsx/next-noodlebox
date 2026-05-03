'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from '@/contexts/LocaleContext';

interface CartSummaryProps {
    showCheckoutButton?: boolean;
}

export default function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
    const { totalItems, totalPrice } = useCart();
    const {t} = useTranslations('ecommerce');

    return (
        <div className="rounded-xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold">{t('checkout.orderSummary')}</h3>
            <Separator className="my-3"/>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>{t('cart.quantity')}</span>
                    <span>{totalItems} {t('cart.itemsUnit')}</span>
                </div>
                <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <Separator className="my-3"/>
                <div className="flex justify-between text-base font-semibold">
                    <span>{t('cart.total')}</span>
                    <span className="text-[#f19e39]">€{totalPrice.toFixed(2)}</span>
                </div>
            </div>

            {showCheckoutButton && (
                <div className="space-y-2 pt-2">
                    <Link href="/checkout" className="block">
                        <Button size="lg" className="w-full h-11">
                            {t('cart.checkout')}
                        </Button>
                    </Link>
                    <Link href="/shop" className="block">
                        <Button variant="outline" size="lg" className="w-full h-11">
                            {t('cart.continueShopping')}
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
