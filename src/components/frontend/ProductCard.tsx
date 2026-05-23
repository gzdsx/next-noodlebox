'use client';

import React from 'react';
import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {useTranslations} from '@/contexts/LocaleContext';
import {ShoppingCartIcon} from "lucide-react";
import {Product} from "@/types";
import {useProductModal} from "@/contexts/CartContext";

export const spicyMap: Record<string, string> = {
    slightly: '/spicy-slightly.png',
    medium: '/spicy-medium.png',
    super: '/spicy-super.png',
}

export default function ProductCard({product}: { product: Product }) {
    const {t} = useTranslations('ecommerce');
    const modal = useProductModal();

    const hasDiscount = product.original_price && product.original_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.original_price!) * 100)
        : 0;
    const metas = product.metas?.reduce((acc, meta) => {
        acc[meta.key] = meta.value;
        return acc;
    }, {}) || {};

    return (
        <div className="group block overflow-hidden bg-[#444] rounded-sm">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-sm">
                {product.thumbnail ? (
                    <Link href={`/product/${product.slug}`}>
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-sm"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        />
                    </Link>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="m21 15-5-5L5 21"/>
                        </svg>
                    </div>
                )}
                {/* Badge */}
                {product.icon && (
                    <Badge variant="destructive" className="absolute top-2 left-2 text-xs m-0">
                        {product.icon}
                    </Badge>
                )}

                {
                    spicyMap[metas.spicy] && (
                        <img src={spicyMap[metas.spicy]} className={'absolute top-2 right-2 w-[24px] h-[24px] md:w-[32px] md:h-[32px]'}
                             alt={metas.spicy}/>
                    )
                }
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="font-medium text-white line-clamp-2 mb-1 min-h-8 leading-4 grow">
                    {product.title}
                </h3>
                <div className={'flex justify-between items-center'}>
                    <span className="text-lg font-bold text-[#66beb8]">
                        €{product.price}
                    </span>
                    <button
                        onClick={() => modal.open(product)}
                        className={'flex items-center gap-2 bg-[#66beb8] text-white px-2 py-1.25 rounded-[5px] hover:bg-[#41918b] cursor-pointer'}>
                        <ShoppingCartIcon size={16}/>
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
