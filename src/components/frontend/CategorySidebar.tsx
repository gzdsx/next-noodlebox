'use client';

import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { apiGet } from '@/lib/api';
import { useTranslations } from '@/contexts/LocaleContext';

interface Category {
    id: number;
    name: string;
    slug: string;
    parent_id?: number;
    children?: Category[];
}

interface CategorySidebarProps {
    selected?: number;
    onSelect: (categoryId: number | undefined) => void;
}

export default function CategorySidebar({ selected, onSelect }: CategorySidebarProps) {
    const {t} = useTranslations('ecommerce');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGet('/categories', { taxonomy: 'product_category' })
            .then(data => {
                const items = Array.isArray(data) ? data : (data?.data || []);
                setCategories(items);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const menuItems: MenuProps['items'] = [
        {
            key: 'all',
            label: t('filter.allCategories'),
            onClick: () => onSelect(undefined),
        },
        ...categories.map(cat => ({
            key: String(cat.id),
            label: cat.name,
            onClick: () => onSelect(cat.id),
            children: cat.children?.length
                ? cat.children.map(child => ({
                    key: String(child.id),
                    label: child.name,
                    onClick: () => onSelect(child.id),
                }))
                : undefined,
        })),
    ];

    if (loading) {
        return <div className="space-y-2 p-2">{Array.from({length: 5}).map((_, i) => (
            <div key={i} className="animate-pulse h-8 bg-gray-100 rounded"/>
        ))}</div>;
    }

    return (
        <Menu
            mode="inline"
            selectedKeys={selected ? [String(selected)] : ['all']}
            items={menuItems}
            className="!border-r-0"
        />
    );
}
