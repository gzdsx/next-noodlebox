'use client';

import React from 'react';
import {Form, Input, Radio, Button} from 'antd';
import {useTranslations} from '@/contexts/LocaleContext';
import {useCart} from '@/contexts/CartContext';

interface CheckoutFormProps {
    onSubmit: (values: any) => Promise<void>;
    submitting?: boolean;
}

export default function CheckoutForm({onSubmit, submitting}: CheckoutFormProps) {
    const [form] = Form.useForm();
    const {t} = useTranslations('ecommerce');
    const {totalPrice, totalItems} = useCart();

    const handleSubmit = async (values: any) => {
        await onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-0"
            initialValues={{
                payment_method: 'wechat',
                name: '大师兄',
                phone_number: '13888888888',
                address: '中国北京市东城区东直门街道',
                city: '北京',
                postal_code: '100000',
            }}
        >
            {/* Shipping Info */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('checkout.shippingInfo')}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                    name="name"
                    label={t('checkout.name')}
                    rules={[{required: true, message: t('checkout.nameRequired')}]}
                >
                    <Input size="large" placeholder={t('checkout.name')}/>
                </Form.Item>

                <Form.Item
                    name="phone_number"
                    label={t('checkout.phone')}
                    rules={[{required: true, message: t('checkout.phoneRequired')}]}
                >
                    <Input size="large" placeholder={t('checkout.phone')}/>
                </Form.Item>
            </div>

            <Form.Item
                name="address"
                label={t('checkout.address')}
                rules={[{required: true, message: t('checkout.addressRequired')}]}
            >
                <Input.TextArea size="large" rows={2} placeholder={t('checkout.address')}/>
            </Form.Item>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item name="city" label={t('checkout.city')}>
                    <Input size="large" placeholder={t('checkout.city')}/>
                </Form.Item>
                <Form.Item name="postal_code" label={t('checkout.zipCode')}>
                    <Input size="large" placeholder={t('checkout.zipCode')}/>
                </Form.Item>
            </div>

            {/* Payment Method */}
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">{t('checkout.paymentMethod')}</h3>
            <Form.Item name="payment_method">
                <Radio.Group className="space-y-3">
                    <Radio value="wechat" className="flex! items-center!">
                        <span className="text-sm">{t('product.wechatPay')}</span>
                    </Radio>
                    <Radio value="alipay" className="flex! items-center!">
                        <span className="text-sm">{t('product.alipay')}</span>
                    </Radio>
                    <Radio value="bank" className="flex! items-center!">
                        <span className="text-sm">{t('product.bankPay')}</span>
                    </Radio>
                </Radio.Group>
            </Form.Item>

            {/* Submit */}
            <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
                className="w-full! h-12! text-base! mt-4!"
            >
                {t('checkout.placeOrder')} · ¥{totalPrice.toFixed(2)}
            </Button>
        </Form>
    );
}
