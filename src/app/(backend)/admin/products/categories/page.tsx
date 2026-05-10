'use client';

import CategoryClient from "@/components/backend/CategoryClient";
import {useTranslations} from '@/contexts/BackendLocaleContext';

export default function Page() {
    const {t} = useTranslations('categories');
    return <CategoryClient taxonomy={'product'} title={t('product_category')}/>;
}