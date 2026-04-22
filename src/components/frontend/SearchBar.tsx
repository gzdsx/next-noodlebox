'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {Input} from 'antd';
import {Search} from 'lucide-react';
import {useTranslations} from '@/contexts/LocaleContext';

interface SearchBarProps {
    className?: string;
}

export default function SearchBar({className}: SearchBarProps) {
    const router = useRouter();
    const {t} = useTranslations('ecommerce');

    const handleSearch = (value: string) => {
        const trimmed = value.trim();
        if (trimmed) {
            router.push(`/products?q=${encodeURIComponent(trimmed)}`);
        }
    };

    return (
        <Input.Search
            placeholder={t('header.searchPlaceholder')}
            allowClear
            onSearch={handleSearch}
            className={className}
            style={{borderRadius: 20}}
            prefix={<Search size={14} className="text-gray-400"/>}
        />
    );
}
