'use client';

import React, {useState} from 'react';
import {App, Card} from "antd";
import {ProductForm, ProductType} from "../ProductForm";
import {useTranslations} from "@/contexts/LocaleContext";
import {apiPost} from "@/lib/backendApi";
import {useRouter} from "next/navigation";

export default function Page() {
    const {t} = useTranslations('products');
    const router = useRouter();
    const {message} = App.useApp();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: ProductType) => {
        try {
            setSubmitting(true);
            const response = await apiPost('/products', values);
            router.replace(`/admin/products/${response.data.id}/edit`);
        } catch (e: unknown) {
            if (e instanceof Error) {
                message.error(e.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card title={t('addProduct')}>
            <ProductForm
                initialValues={{
                    title: '',
                    description: '',
                    content: '',
                    thumbnail: '',
                    price: 0,
                    regular_price: 0,
                    status: 'active',
                    sort_num: 0,
                    categories: [],
                    images: [],
                    skus: [],
                    variants: [],
                    has_sku_attr: false,
                    sold:100,
                    stock:100,
                    points:0,
                }}
                submitting={submitting}
                onSubmit={handleSubmit}
            />
        </Card>
    );
}
