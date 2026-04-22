'use client';

import React from 'react';
import {Select} from 'antd';
import {useTranslations} from '@/contexts/LocaleContext';

interface ProductListFiltersProps {
    sort?: string;
    onSortChange: (sort: string) => void;
}

const sortOptions = [
    {value: 'default', key: 'default'},
    {value: 'sales', key: 'bestSelling'},
    {value: 'price_asc', key: 'priceAsc'},
    {value: 'price_desc', key: 'priceDesc'},
    {value: 'created_at', key: 'newest'},
];

export default function ProductListFilters({sort, onSortChange}: ProductListFiltersProps) {
    const {t} = useTranslations('ecommerce');

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{t('filter.sort')}:</span>
            <Select
                value={sort || 'default'}
                onChange={onSortChange}
                size="middle"
                className="!w-40"
                options={sortOptions.map(opt => ({
                    value: opt.value,
                    label: t(`filter.${opt.key}`),
                }))}
            />
        </div>
    );
}
