'use client';

import React, {useState, useCallback} from 'react';
import Link from 'next/link';
import {App, Breadcrumb, Tabs, InputNumber, Button, Tag} from 'antd';
import {ShoppingCart, Zap} from 'lucide-react';
import {useTranslations} from '@/contexts/LocaleContext';
import {useCart} from '@/contexts/CartContext';
import ProductImageGallery from '@/components/frontend/ProductImageGallery';
import VariantSelector from '@/components/frontend/VariantSelector';

interface SkuItem {
    id?: number,
    name: string;
    price: number;
    stock: number;
    properties: string;
}

interface ImageItem {
    src: string;
    alt: string;
}

export interface Product {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    thumbnail: string;
    price: number;
    original_price: number;
    status: string;
    icon?: string;
    sold?: number;
    images?: ImageItem[];
    skus?: SkuItem[];
    categories?: { id: number; name: string }[];
    keywords?: string;
    has_sku_attr?: boolean;
    variants?: { name: string; options: { title: string; price?: number }[] }[];
}

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({product}: ProductDetailClientProps) {
    const {message} = App.useApp();
    const {t} = useTranslations('ecommerce');
    const {addItem} = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedSku, setSelectedSku] = useState<SkuItem | null>(null);

    const handleSkuChange = useCallback((sku: SkuItem | null) => {
        console.log('Selected SKU:', sku);
        setSelectedSku(sku);
    }, []);

    const currentPrice = selectedSku?.price ?? product.price;
    const currentStock = selectedSku?.stock ?? 999;
    const isOutOfStock = currentStock <= 0;

    const handleAddToCart = () => {
        if (product.skus?.length && !selectedSku){
            message.error('请选择产品规格');
            return false;
        }
        addItem({
            product_id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: currentPrice,
            quantity,
            sku_id: selectedSku?.id,
            sku_name: selectedSku?.name,
        });
        message.success(t('product.addToCart') + ' ✓');
    };

    const handleBuyNow = () => {
        handleAddToCart();
        window.location.href = '/cart';
    };

    const hasDiscount = product.original_price && product.original_price > currentPrice;
    const discountPercent = hasDiscount
        ? Math.round((1 - currentPrice / product.original_price) * 100)
        : 0;

    const tabItems = [
        {
            key: 'description',
            label: t('product.description'),
            children: (
                <div className="prose prose-sm max-w-none"
                     dangerouslySetInnerHTML={{__html: product.content || `<p>${t('product.noDescription')}</p>`}}/>
            ),
        },
        {
            key: 'specs',
            label: t('product.specs'),
            children: (
                <div className="text-sm text-gray-600 space-y-2">
                    {product.description && <p>{product.description}</p>}
                    {selectedSku && (
                        <div className="mt-4">
                            <p className="font-medium">SKU: {selectedSku.name}</p>
                            <p>{t('product.stock')}: {selectedSku.stock}</p>
                        </div>
                    )}
                    {product.keywords?.length ? (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {product.keywords.split(',').map(kw => (
                                <Tag key={kw}>{kw}</Tag>
                            ))}
                        </div>
                    ) : null}
                </div>
            ),
        },
        {
            key: 'reviews',
            label: t('product.reviews'),
            children: (
                <div className="text-center py-12 text-gray-400">{t('product.noReviews')}</div>
            ),
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <Breadcrumb
                items={[
                    {title: <Link href="/">{t('header.home')}</Link>},
                    {title: <Link href="/products">{t('header.products')}</Link>},
                    ...(product.categories?.length
                        ? [{title: product.categories[0].name}]
                        : []),
                    {title: product.title},
                ]}
                className="mb-6!"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProductImageGallery images={product.images} title={product.title}/>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                        {product.icon && <Tag color="red" className="text-sm!">{product.icon}</Tag>}
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-red-500">¥{currentPrice}</span>
                            {hasDiscount && (
                                <>
                                    <span
                                        className="text-lg text-gray-400 line-through">¥{product.original_price}</span>
                                    <Tag color="red">-{discountPercent}%</Tag>
                                </>
                            )}
                        </div>
                        <span className="text-sm text-gray-500 mt-1 block">{t('product.sold')} {product.sold}</span>
                    </div>

                    {product.has_sku_attr && (
                        <VariantSelector
                            variants={product.variants || []}
                            skus={product.skus || []}
                            onSkuChange={handleSkuChange}
                        />
                    )}

                    <div>
                        <span className="text-sm font-medium text-gray-700 mr-3">{t('product.quantity')}:</span>
                        <InputNumber min={1} max={currentStock} value={quantity}
                                     onChange={val => setQuantity(val || 1)}/>
                        <span className="text-sm text-gray-400 ml-2">
                            {isOutOfStock ? t('product.outOfStock') : t('product.inStock')}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <Button type="primary" size="large" icon={<ShoppingCart size={18}/>}
                                onClick={handleAddToCart} disabled={isOutOfStock}
                                className="flex-1! h-12! text-base!">
                            {t('product.addToCart')}
                        </Button>
                        <Button size="large" icon={<Zap size={18}/>} onClick={handleBuyNow}
                                disabled={isOutOfStock}
                                className="flex-1! h-12! text-base! bg-orange-500! text-white! hover:bg-orange-600! border-orange-500!">
                            {t('product.buyNow')}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <Tabs items={tabItems}/>
            </div>
        </div>
    );
}
