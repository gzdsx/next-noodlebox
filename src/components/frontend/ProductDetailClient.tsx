'use client';

import React, {useState, useCallback} from 'react';
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {NumberInput} from '@/components/ui/number-input';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {ShoppingCart, ShoppingCartIcon, Zap} from 'lucide-react';
import {useTranslations} from '@/contexts/LocaleContext';
import {useCart} from '@/contexts/CartContext';
import {toast} from 'sonner';
import ProductImageGallery from '@/components/frontend/ProductImageGallery';
import VariantSelector from '@/components/frontend/VariantSelector';
import {Product, SkuItem} from "@/types";

export default function ProductDetailClient({product}: { product: Product }) {
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
        if (product.skus?.length && !selectedSku) {
            toast.error('请选择产品规格');
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
        toast.success(t('product.addToCart') + ' ✓');
    };

    const handleBuyNow = () => {
        handleAddToCart();
        window.location.href = '/cart';
    };

    const renderBadges = () => {
        if (!product.meta_data?.badges?.length) {
            return null;
        }

        return (
            <div className={'flex flex-row gap-2'}>
                {
                    product.meta_data?.badges?.map((badge: string) => (
                        <img
                            key={`badge-${badge}`}
                            className={'w-7.5 h-7.5 object-contain'}
                            src={badge}
                            alt={''}
                        />
                    ))
                }
            </div>
        )
    }

    const renderVariants = () => {
        if (!product.variation_list?.length) {
            return null;
        }

        return (
            <div className={'flex flex-col gap-2'}>
                {
                    product.variation_list?.map((variation: any) => (
                        <div key={`variation-${variation.name}`}>
                            <div className={`text-white font-bold mb-2`}>{variation.name}</div>
                            <div className={`flex flex-row flex-wrap gap-2`}>
                                {
                                    variation.options?.map((option: any) => (
                                        <span
                                            key={`option-${variation.name}-${option.title}`}
                                            className={`px-2 py-2 cursor-pointer whitespace-nowrap rounded-md border border-[#66beb8] text-[12px] font-light ${option.selected ? 'bg-[#66beb8] text-white' : 'text-[#66beb8]'}`}
                                        >{option.title}</span>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }

    const renderAdditionalOptions = () => {
        if (!product.additional_options?.length) {
            return null;
        }

        return (
            <div key={`product-additional-options`}>
                <div className={`text-white font-bold mb-2`}>{'Additional Options'}</div>
                <div className={`flex flex-row flex-wrap gap-2`}>
                    {
                        product.additional_options?.map((option: any) => (
                            <span
                                key={`additional-option-${option.title}`}
                                className={`px-2 py-2 cursor-pointer whitespace-nowrap rounded-md border border-[#66beb8] text-[12px] font-light ${option.selected ? 'bg-[#66beb8] text-white' : 'text-[#66beb8]'}`}
                            >{option.title}</span>
                        ))
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-350 mx-auto px-4 py-6">
            <div className={'h-24'}></div>
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">{t('header.home')}</Link>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProductImageGallery images={product.images} title={product.title}/>

                <div className="space-y-4">
                    <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                    <div className={'bg-[#66beb8] px-4 py-2 rounded text-white'}>
                        Earn Points : {product.points} Points
                    </div>
                    <div className={'rounded text-[#71f4fd] font-bold text-2xl'}>
                        {`€${currentPrice}`}
                    </div>
                    <div dangerouslySetInnerHTML={{__html: product.description}} className={'text-[#f19e39]'}></div>
                    {renderBadges()}
                    {renderVariants()}
                    {renderAdditionalOptions()}

                    <div className={'mt-2'}>
                        <label className={'flex flex-row gap-2 items-center'}>
                            <input
                                type={'checkbox'}
                                className={'transform scale-150'}
                            />
                            <span className={'text-[#f19e39]'}>Use 100 Noodle Box Points for purchasing this Product</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3 mt-8">
                        <NumberInput
                            min={1}
                            max={currentStock}
                            value={quantity}
                            onChange={val => setQuantity(val)}
                        />
                        <button
                            className={'flex cursor-pointer bg-[#be2e2d] text-white px-4 py-2 rounded-md items-center gap-2 hover:bg-red-800'}
                        >
                            <ShoppingCartIcon/>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
}
