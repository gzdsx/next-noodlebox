import React from "react";
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {apiGet} from '@/lib/api';
import {getTranslations} from '@/lib/i18n';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {ProductInfoClient} from "@/components/frontend/ProductInfoClient";
import {Product} from "@/types";

async function fetchProduct(id: string): Promise<Product | null> {
    try {
        const response = await apiGet(`/products/${id}`);
        return {...response.data};
    } catch {
        return null;
    }
}

export default async function ProductDetailPage({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const product = await fetchProduct(slug);
    const {t} = getTranslations('ecommerce');

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-gray-200">{t('page.productNotFound')}</p>
                <Link href="/products">
                    <Button className="mt-4">{t('page.backToProducts')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-350 mx-auto px-4 py-6">
            <div className={'h-24'}></div>
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className={'text-white'}>{'Home'}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {product.categories?.length ? (
                        <>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbPage className={'text-white'}>{product.categories[0].name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    ) : null}
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage className={'text-white'}>{product.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <ProductInfoClient product={product}/>
        </div>
    );
}
