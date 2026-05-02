import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {apiGet} from '@/lib/api';
import { getTranslations } from '@/lib/i18n';
import ProductDetailClient, {Product} from '@/components/frontend/ProductDetailClient';

async function fetchProduct(id: string): Promise<Product | null> {
    try {
        const response = await apiGet(`/products/${id}`);
        return {...response.data};
    } catch {
        return null;
    }
}

export default async function ProductDetailPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const product = await fetchProduct(id);
    const { t } = getTranslations('ecommerce');

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-gray-500">{t('page.productNotFound')}</p>
                <Link href="/products">
                    <Button className="mt-4">{t('page.backToProducts')}</Button>
                </Link>
            </div>
        );
    }

    return <ProductDetailClient product={product}/>;
}
