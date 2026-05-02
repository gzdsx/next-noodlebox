'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Input} from '@/components/ui/input';
import {Search, X} from 'lucide-react';
import {useTranslations} from '@/contexts/LocaleContext';

interface SearchBarProps {
    className?: string;
}

export default function SearchBar({className}: SearchBarProps) {
    const router = useRouter();
    const {t} = useTranslations('ecommerce');
    const [value, setValue] = useState('');

    const handleSearch = () => {
        const trimmed = value.trim();
        if (trimmed) {
            router.push(`/products?q=${encodeURIComponent(trimmed)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={`relative ${className || ''}`}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <Input
                placeholder={t('header.searchPlaceholder')}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 pr-9 rounded-full"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => setValue('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X size={14}/>
                </button>
            )}
        </div>
    );
}
