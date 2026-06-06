'use client';

import Link from 'next/link';
import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {ResultPage} from '@/components/ui/result-page';
import {useTranslations} from '@/contexts/LocaleContext';
import CheckoutForm from '@/components/frontend/CheckoutForm';
import CheckoutSummary, {CheckoutOrderInfo} from "@/components/frontend/CheckoutSummary";
import {useCart} from "@/contexts/CartContext";
import CheckoutNoticeDialog from "@/components/frontend/CheckoutNoticeDialog";

export default function CheckoutClient({options = {}}: {
    options?: any,
}) {
    const {clearCart} = useCart();
    const {t} = useTranslations('ecommerce');
    const [orderData, setOrderData] = useState<CheckoutOrderInfo>({
        total: 0,
        subtotal: 0,
        shipping_total: 0,
        payment_fee: 0,
    });
    const [showWarning, setShowWarning] = useState(!options.in_delivery_hours);
    const [orderStatus, setOrderStatus] = useState('');

    if (orderStatus === 'placed') {
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

    if (orderStatus === 'pending') {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <ResultPage
                    status="success"
                    title={'Your order has been created but not yet paid.'}
                    description={'You can click \'My Orders\' to complete your payment.'}
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
                            onPlaced={(orderId: number, status: string) => {
                                clearCart();
                                setOrderStatus(status);
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
            {
                showWarning &&
                <CheckoutNoticeDialog message={options.order_warning} onClose={() => setShowWarning(false)}/>
            }
        </div>
    );
}
