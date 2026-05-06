'use client';

import React from 'react';
import {Separator} from '@/components/ui/separator';
import {useCart} from '@/contexts/CartContext';
import {useTranslations} from '@/contexts/LocaleContext';
import {CartItem} from "@/types";

export interface CheckoutOrderInfo {
    total: number;
    subtotal: number;
    shipping_total: number;
    payment_fee: number;
}

export default function CheckoutSummary({orderData}: { orderData: CheckoutOrderInfo }) {
    const {totalItems, items} = useCart();
    const {t} = useTranslations('ecommerce');

    const renderOptions = (item: CartItem) => {
        const names: string[] = [];
        try {
            const regex = /^(?!.*(none|original)).*$/i;
            item.options?.forEach(option => {
                if (regex.test(option.value || '')) {
                    names.push(option.value as string);
                }
            });

            item.additional_options?.forEach(option => {
                if (regex.test(option.name)) {
                    names.push(option.name);
                }
            })
        } catch {

        }
        return names.join(', ');
    }

    return (
        <div className="rounded-xl border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold">{t('checkout.orderSummary')}</h3>
            <Separator className="my-3"/>
            <div className="space-y-2 text-sm">
                <div className={'flex flex-col gap-y-2'}>
                    {
                        items.map(item => (
                            <div key={item.id} className="flex justify-between gap-x-2">
                                <div className={'grow'}>
                                    <div className={'text-[#f19e39] text-[16px] font-medium'}>{item.title}</div>
                                    <div className={'text-[#66beb8] leading-4'}>{renderOptions(item)}</div>
                                </div>
                                <div className={'text-right'}>
                                    <p>€{item.price}</p>
                                    <p>x{item.quantity}</p>
                                </div>

                            </div>
                        ))
                    }
                </div>
                <Separator className="my-3"/>
                <div className="flex justify-between">
                    <span>{t('cart.quantity')}</span>
                    <span>{totalItems} {t('cart.itemsUnit')}</span>
                </div>
                <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>€{orderData.subtotal}</span>
                </div>
                <div className="flex justify-between">
                    <span>{'Delivery Fee'}</span>
                    <span>+€{orderData.shipping_total}</span>
                </div>
                {
                    Number(orderData.payment_fee) > 0 && (
                        <div className="flex justify-between">
                            <span>{'ADM Fee'}</span>
                            <span>+€{orderData.payment_fee}</span>
                        </div>
                    )
                }
                <Separator className="my-3"/>
                <div className="flex justify-between text-base font-semibold">
                    <span>{t('cart.total')}</span>
                    <span className="text-[#f19e39]">€{orderData.total}</span>
                </div>
            </div>
        </div>
    );
}
