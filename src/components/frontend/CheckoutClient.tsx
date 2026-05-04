'use client';

import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {Button} from '@/components/ui/button';
import {Spinner} from '@/components/ui/spinner';
import {ResultPage} from '@/components/ui/result-page';
import {useTranslations} from '@/contexts/LocaleContext';
import CheckoutForm from '@/components/frontend/CheckoutForm';
import Link from 'next/link';
import {ShippingAddress, ShippingZone} from "@/types";
import CheckoutSummary, {CheckoutOrderInfo} from "@/components/frontend/CheckoutSummary";
import {useCart} from "@/contexts/CartContext";

export default function CheckoutClient({options, address, shippingZones}: {
    options?: any,
    address?: ShippingAddress,
    shippingZones?: ShippingZone[]
}) {
    const {data: session, status} = useSession();
    const {t} = useTranslations('ecommerce');
    const {clearCart} = useCart();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderData, setOrderData] = useState<CheckoutOrderInfo>({
        total: 0,
        subtotal: 0,
        shipping_total: 0,
        payment_fee: 0,
    });

    useEffect(() => {
        if (!session) {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.href);
        }
    }, [session])

    if (status === 'loading') {
        return <div className="flex justify-center py-24"><Spinner size="lg"/></div>;
    }

    if (orderPlaced) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <ResultPage
                    status="success"
                    title={t('checkout.orderPlaced')}
                    description={t('checkout.orderPlacedSubtitle')}
                >
                    <Link href="/user/orders">
                        <Button>{t('header.myOrders')}</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline">{t('checkout.backToHome')}</Button>
                    </Link>
                </ResultPage>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className={'h-24'}></div>
            <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-100 p-6">
                        <CheckoutForm
                            options={options}
                            onChange={values => {
                                setOrderData(prevState => ({...prevState, ...values}));
                            }}
                            onPlaced={() => {
                                clearCart();
                                setOrderPlaced(true);
                            }}
                        />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky top-20">
                        <CheckoutSummary orderData={orderData}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
