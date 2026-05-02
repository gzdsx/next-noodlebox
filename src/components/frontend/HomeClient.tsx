'use client';

import React from 'react';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {useTranslations} from '@/contexts/LocaleContext';

interface HomeClientProps {
    section: 'hotProducts' | 'promotions' | 'newArrivals';
}

export default function HomeClient({section}: HomeClientProps) {
    const {t} = useTranslations('ecommerce');

    if (section === 'hotProducts') {
        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900">{t('home.hotProducts')}</h2>
                <Link href="/products?sort=sales"
                      className="text-primary hover:underline flex items-center gap-1 text-sm">
                    {t('home.viewAll')}
                    <ArrowRight size={16}/>
                </Link>
            </>
        );
    }

    if (section === 'promotions') {
        return (
            <>
                <h2 className="text-3xl font-bold mb-3">{t('home.promotions')}</h2>
                <p className="text-orange-100 mb-6">{t('home.heroSubtitle')}</p>
                <Link href="/products">
                    <button
                        className="bg-white text-orange-600 font-semibold border-0 hover:bg-gray-100 h-11 px-8 rounded-md">
                        {t('home.shopNow')}
                    </button>
                </Link>
            </>
        );
    }

    if (section === 'newArrivals') {
        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900">{t('home.newArrivals')}</h2>
                <Link href="/products?sort=created_at"
                      className="text-primary hover:underline flex items-center gap-1 text-sm">
                    {t('home.viewAll')}
                    <ArrowRight size={16}/>
                </Link>
            </>
        );
    }

    return null;
}
