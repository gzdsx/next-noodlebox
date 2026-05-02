'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        apiGet('/categories', { taxonomy: 'product_category' })
            .then(data => {
                const items = Array.isArray(data) ? data : (data?.data || []);
                setCategories(items);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const toggleExpand = (key: string) => {
        setExpandedKeys(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    if (loading) {
        return <div className="space-y-2 p-2">{Array.from({length: 5}).map((_, i) => (
            <div key={i} className="animate-pulse h-8 bg-gray-100 rounded"/>
        ))}</div>;
    }

    return (
        <nav className="space-y-0.5">
            {/* All categories */}
            <button
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selected === undefined
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onSelect(undefined)}
            >
                {t('filter.allCategories')}
            </button>

            {/* Category items */}
            {categories.map(cat => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isExpanded = expandedKeys.has(String(cat.id));
                const isSelected = selected === cat.id;

                return (
                    <div key={cat.id}>
                        <button
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                                isSelected
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                                if (hasChildren) {
                                    toggleExpand(String(cat.id));
                                }
                                onSelect(cat.id);
                            }}
                        >
                            <span>{cat.name}</span>
                            {hasChildren && (
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                />
                            )}
                        </button>
                        {hasChildren && isExpanded && (
                            <div className="ml-4 space-y-0.5">
                                {cat.children!.map(child => (
                                    <button
                                        key={child.id}
                                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                                            selected === child.id
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        onClick={() => onSelect(child.id)}
                                    >
                                        {child.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
