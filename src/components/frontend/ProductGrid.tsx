'use client';

import React from 'react';
import {Spinner} from '@/components/ui/spinner';
import ProductCard from './ProductCard';
import {useTranslations} from '@/contexts/LocaleContext';
import {Product} from "@/types";

interface ProductGridProps {
    products: Product[];
    loading?: boolean;
    columns?: number;
}

export default function ProductGrid({products, loading, columns = 5}: ProductGridProps) {
    const {t} = useTranslations('ecommerce');
    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner size="lg"/>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">{t('product.noProducts')}</div>
        );
    }

    const gridCols: Record<number, string> = {
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    };

    return (
        <div className={`grid ${gridCols[columns] || gridCols[5]} gap-4`}>
            {products.map(product => (
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
    );
}
