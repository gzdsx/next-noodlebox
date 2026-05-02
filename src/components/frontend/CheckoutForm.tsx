'use client';

import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {useTranslations} from '@/contexts/LocaleContext';
import {useCart} from '@/contexts/CartContext';

interface CheckoutFormProps {
    onSubmit: (values: any) => Promise<void>;
    submitting?: boolean;
}

export default function CheckoutForm({onSubmit, submitting}: CheckoutFormProps) {
    const {t} = useTranslations('ecommerce');
    const {totalPrice, totalItems} = useCart();

    const [form, setForm] = useState({
        name: '大师兄',
        phone_number: '13888888888',
        address: '中国北京市东城区东直门街道',
        city: '北京',
        postal_code: '100000',
        payment_method: 'wechat',
    });

    const updateField = (field: string, value: string) => {
        setForm(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-0">
            {/* Shipping Info */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('checkout.shippingInfo')}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('checkout.name')}</Label>
                    <Input
                        id="name"
                        className="h-11"
                        placeholder={t('checkout.name')}
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone_number">{t('checkout.phone')}</Label>
                    <Input
                        id="phone_number"
                        className="h-11"
                        placeholder={t('checkout.phone')}
                        value={form.phone_number}
                        onChange={(e) => updateField('phone_number', e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2 mt-4">
                <Label htmlFor="address">{t('checkout.address')}</Label>
                <Textarea
                    id="address"
                    rows={2}
                    placeholder={t('checkout.address')}
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="city">{t('checkout.city')}</Label>
                    <Input
                        id="city"
                        className="h-11"
                        placeholder={t('checkout.city')}
                        value={form.city}
                        onChange={(e) => updateField('city', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="postal_code">{t('checkout.zipCode')}</Label>
                    <Input
                        id="postal_code"
                        className="h-11"
                        placeholder={t('checkout.zipCode')}
                        value={form.postal_code}
                        onChange={(e) => updateField('postal_code', e.target.value)}
                    />
                </div>
            </div>

            {/* Payment Method */}
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">{t('checkout.paymentMethod')}</h3>
            <RadioGroup
                value={form.payment_method}
                onValueChange={(value) => updateField('payment_method', value)}
                className="space-y-3"
            >
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="wechat" id="wechat"/>
                    <Label htmlFor="wechat" className="text-sm cursor-pointer">{t('product.wechatPay')}</Label>
                </div>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="alipay" id="alipay"/>
                    <Label htmlFor="alipay" className="text-sm cursor-pointer">{t('product.alipay')}</Label>
                </div>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="bank" id="bank"/>
                    <Label htmlFor="bank" className="text-sm cursor-pointer">{t('product.bankPay')}</Label>
                </div>
            </RadioGroup>

            {/* Submit */}
            <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full h-12 text-base mt-4"
            >
                {submitting ? '...' : `${t('checkout.placeOrder')} · ¥${totalPrice.toFixed(2)}`}
            </Button>
        </form>
    );
}
